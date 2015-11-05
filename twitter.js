var Promise = require('bluebird');
var Twit = require('twit');

var client = Promise.promisifyAll(new Twit({
  consumer_key: process.env.TWEETDEX_TWITTER_API_KEY,
  consumer_secret: process.env.TWEETDEX_TWITTER_API_SECRET,
  access_token: process.env.TWEETDEX_TWITTER_OAUTH_TOKEN,
  access_token_secret: process.env.TWEETDEX_TWITTER_OAUTH_SECRET,
}));

// Compose and post a reply to a given user.
function reply(tweetId, user, msg) {
  var status = '@' + user + ' ' + msg;
  return client.postAsync(
    'statuses/update',
    { status: status, in_reply_to_status_id: tweetId }
  );
}

module.exports = {
  client: client,
  reply: reply,
};
