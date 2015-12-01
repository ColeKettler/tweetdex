'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Twit = require('twit');
var logger = require('./logger');
var utils = require('./utils');

var client = Promise.promisifyAll(new Twit({
  consumer_key: process.env.TWEETDEX_TWITTER_API_KEY,
  consumer_secret: process.env.TWEETDEX_TWITTER_API_SECRET,
  access_token: process.env.TWEETDEX_TWITTER_OAUTH_TOKEN,
  access_token_secret: process.env.TWEETDEX_TWITTER_OAUTH_SECRET,
}));

// Compose and post a reply to a given tweet / user.
function reply(tweetId, msg, user) {
  var statuses = splitTweet(msg, user);
  var replyToId = tweetId;

  return Promise.each(statuses, function(status) {
    var posting = utils.retry(postReply.bind(null, replyToId, status), 2);
    return posting
      .then(function(tweet) {
        replyToId = tweet.id_str;
      })
      .error(function(err) {
        var errInfo = _.pick(err, ['code', 'statusCode', 'message']);
        logger.warn('Tweet failed to send', { error: errInfo });
      });
  });
}

function postReply(tweetId, status) {
  return client.postAsync(
    'statuses/update',
    { status: status, in_reply_to_status_id: tweetId }
  );
}

// Split a long tweet into multiple tweets under 140 chars. Or not.
function splitTweet(msg, user) {
  var chunks = splitMessageIntoChunks(msg, user);
  return _.map(chunks, function(msg, idx, coll) {
    var isContinuation = idx > 0;
    var isTruncated = idx + 1 < coll.length;
    return buildTweet(msg, user, isContinuation, isTruncated);
  });
}

// Get message chunks for a tweet, leaving room for @mentions and such.
function splitMessageIntoChunks(msg, user) {
  var chunks = [];

  var currChar = 0;
  while (currChar < msg.length) {
    var msgRemaining = msg.slice(currChar);
    var isContinuation = currChar > 0;
    var maxChars = getMaxCharacters(msgRemaining, user, isContinuation);

    var chunk = utils.truncateAtWord(msgRemaining, maxChars);
    currChar += chunk.length + 1;
    chunks.push(chunk);
  }

  return chunks;
}

// Assemble a tweet, including @mentions and continuations.
function buildTweet(msg, user, isTruncated, isContinuation) {
  var statusChunks = [msg];
  if (isTruncated) {
    statusChunks.unshift('...');
  }
  if (isContinuation) {
    statusChunks.push('...');
  }
  if (user) {
    statusChunks.unshift('@' + user);
  }

  return statusChunks.join(' ');
}

// Get max characters for a tweet, accounting for @mentions and continuations.
// Shamelessly breaks down with more than 9 tweets. Take a moment to breathe.
function getMaxCharacters(msg, user, isContinuation) {
  var n = 140;
  if (user) {
    // Requires leading "@" and trailing " ".
    n -= user.length + 2;
  }
  if (msg.length > n) {
    // Leave room for an ellipsis if necessary. " ..." = 4.
    n -= 4;
  }
  if (isContinuation) {
    // Leave room for a leading ellipsis if in sequence. "... " = 4.
    n -= 4;
  }
  return n;
}

// Convert tweet body to lowercase text.
function normalizeTweetText(txt) {
  return _(txt.split(' '))
    .reject(function(word) {
      // Remove @mentions from body of tweet.
      return _.startsWith(word, '@');
    })
    .map(function(word) {
      // Strip #hashtags.
      return _.trimLeft(word, '#');
    })
    .map(function(word) {
      return word.toLowerCase();
    })
    .join(' ');
}

module.exports = {
  client: client,
  reply: reply,
  utils: {
    normalizeTweetText: normalizeTweetText,
  },
};
