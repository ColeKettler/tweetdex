var Promise = require('bluebird');
var Twit = require('twit');
var api = require('./api');

var client = Promise.promisifyAll(new Twit({
  consumer_key: process.env.TWEETDEX_TWITTER_API_KEY,
  consumer_secret: process.env.TWEETDEX_TWITTER_API_SECRET,
  access_token: process.env.TWEETDEX_TWITTER_OAUTH_TOKEN,
  access_token_secret: process.env.TWEETDEX_TWITTER_OAUTH_SECRET,
}));

var stream = client.stream('user', { with: 'user' });

stream.on('tweet', function(tweet) {
  var user = tweet.user['screen_name'];
  // Don't talk to yourself, silly robot
  if (user === 'tweetdexbot') {
    return;
  }

  var pokemon = getPokemonName(tweet.text);
  api.getPokedexEntry(pokemon)
    .then(function(entry) {
      return replyToTweet(tweet.id, user, entry);
    });
});

// Compose and post a reply to a given user.
function replyToTweet(tweetId, user, msg) {
  var status = '@' + user + ' ' + msg;
  return client.postAsync(
    'statuses/update',
    { status: status, in_reply_to_status_id: tweetId }
  );
}

// Extract a Pokemon name to look up from the body of a tweet.
function getPokemonName(text) {
  return 'relicanth';
}
