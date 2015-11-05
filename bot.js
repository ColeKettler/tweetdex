var _ = require('lodash');
var pokeapi = require('./pokeapi');
var twitter = require('./twitter');

var stream = twitter.client.stream('user', { with: 'user' });

stream.on('tweet', function(tweet) {
  var user = tweet.user['screen_name'];
  // Don't talk to yourself, silly robot
  if (user === 'tweetdexbot') {
    return;
  }

  extractPokemon(tweet.text)
    .then(function(pokemon) {
      return pokeapi.getPokedexEntry(pokemon);
    })
    .then(function(entry) {
      return twitter.reply(tweet.id_str, entry, user);
    });
});

// Extract a Pokemon name to look up from the body of a tweet.
function extractPokemon(text) {
  return pokeapi.getPokemonList()
    .then(function(list) {
      var pokemon = _(text.split(' '))
        .reject(function(word) {
          return _.startsWith(word, '@');
        })
        .map(function(word) {
          return word.toLowerCase();
        })
        .find(function(word) {
          return _.some(list, { 'name': word });
        });
      return pokemon;
    });
}
