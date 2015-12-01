'use strict';

var errors = require('./errors');
var logger = require('./logger'); // jshint ignore:line
var pokeapi = require('./pokeapi');
var twitter = require('./twitter');

var stream = twitter.client.stream('user', { with: 'user' });

// Listen for and respond to incoming @mentions.
stream.on('tweet', function(tweet) {
  var user = tweet.user.screen_name;
  // Don't talk to yourself, silly robot
  if (user === 'tweetdexbot') {
    return;
  }

  var txt = twitter.utils.normalizeTweetText(tweet.text);
  pokeapi.utils.getPokemonFromText(txt)
    .then(pokeapi.getPokedexEntry)
    .catch(errors.PokemonNotFoundError, function() {
      return 'Sorry, I could not find a Pokémon in your request.';
    })
    .then(function(status) {
      return twitter.reply(tweet.id_str, status, user);
    });
});
