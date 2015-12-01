'use strict';

var _ = require('lodash');
var logger = require('./logger'); // jshint ignore:line
var pokeapi = require('./pokeapi');
var twitter = require('./twitter');
var PokemonNotFoundError = require('./errors').PokemonNotFoundError;

var stream = twitter.client.stream('user', { with: 'user' });

stream.on('tweet', function(tweet) {
  var user = tweet.user.screen_name;
  // Don't talk to yourself, silly robot
  if (user === 'tweetdexbot') {
    return;
  }

  extractPokemon(tweet.text)
    .then(function(pokemon) {
      return pokeapi.getPokedexEntry(pokemon)
        .then(function(entry) {
          return twitter.reply(tweet.id_str, entry, user);
        });
    })
    .catch(PokemonNotFoundError, function() {
      var status = 'Sorry, I could not find a Pokémon in your request.';
      return twitter.reply(tweet.id_str, status, user);
    });
});

// Extract a Pokemon name to look up from the body of a tweet.
function extractPokemon(text) {
  return pokeapi.getPokemonList()
    .then(function(list) {
      var words = text.match(/(@?\b\S+\b)/g);
      var pokemon = _(words)
        .reject(function(word) {
          return _.startsWith(word, '@');
        })
        .map(function(word) {
          return word.toLowerCase();
        })
        .find(function(word) {
          return _.some(list, { 'name': word });
        });

      if (_.isUndefined(pokemon)) {
        throw new PokemonNotFoundError('No Pokémon found in text body.');
      }
      return pokemon;
    });
}
