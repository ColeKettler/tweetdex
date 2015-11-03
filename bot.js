var Twit = require('twit');

var client = new Twit({
  consumer_key: process.env.TWEETDEX_TWITTER_API_KEY,
  consumer_secret: process.env.TWEETDEX_TWITTER_API_SECRET,
  access_token: process.env.TWEETDEX_TWITTER_OAUTH_TOKEN,
  access_token_secret: process.env.TWEETDEX_TWITTER_OAUTH_SECRET,
});

var stream = client.stream('user', { with: 'user' });

stream.on('tweet', function(tweet) {
  // Don't talk to yourself, silly robot
  if (tweet.user['screen_name'] === 'tweetdexbot') {
    return;
  }

  var pokemon = getPokemonName(tweet.text);
  var entry = getPokedexEntry(pokemon);

  client.post(
    'statuses/update',
    { status: entry, in_reply_to_status_id: tweet.id },
    function(err, data, res) {

    }
  );
});

// Extract a Pokemon name to look up from the body of a tweet.
function getPokemonName(text) {
  return 'relicanth';
}

// Retrieve the national Pokedex list from Pokeapi.
function getPokedexList() {
  return [
    { name: 'relicanth', resource_uri: 'api/v1/pokemon/369/' }
  ];
}

// Look up a Pokemon on Pokeapi and return a random Pokedex entry.
function getPokedexEntry(pokemon) {
  return 'It has remained unchanged for 100 million years. It was discovered during a deep-sea exploration.';
}
