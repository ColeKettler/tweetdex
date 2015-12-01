// Data provided by Pokéapi (http://pokeapi.co/),
// created by Paul Hallett (https://github.com/phalt) and other contributors.

'use strict';

var _ = require('lodash');
var Pkmn = require('pkmn');
var cache = require('./cache');
var errors = require('./errors');
var utils = require('./utils');

var pkmn = new Pkmn();

// Retrieve a list of all Pokemon from the National Dex.
function getPokedex() {
  return getCachedApiResource('pokedex')
    .then(function(pokedex) {
      return filterPokemonList(pokedex.pokemon);
    });
}

// Look up a Pokemon on Pokeapi and return a random Pokedex entry.
function getPokedexEntry(name) {
  return getCachedApiResource('pokemon', name)
    .then(function(pokemon) {
      var id = getRandomDescriptionId(pokemon);
      return getDescription(id);
    });
}

// Get a Pokedex entry.
function getDescription(id) {
  return getCachedApiResource('description', id)
    .then(function(description) {
      // Fix missing "é" in "Pokémon".
      return fixPokemonSpelling(description.description);
    });
}

// From a Pokemon resource, pick a random ID from a list of description entries.
function getRandomDescriptionId(pokemon) {
  var descriptions = pokemon.descriptions;
  var r = utils.getRandomInt(0, descriptions.length);
  var descriptionUri = descriptions[r].resource_uri;
  return getDescriptionId(descriptionUri);
}

// Extract description ID from a description URI.
function getDescriptionId(uri) {
  var rx = /description\/(\d+)\//;
  var match = rx.exec(uri);
  return match[1];
}

// Filter and sanitize list of Pokemon.
function filterPokemonList(list) {
  return _.pluck(list, 'name');
}

// Find the first Pokemon to occur in text.
function getPokemonFromText(text) {
  return getPokedex()
    .then(function(pokedex) {
      var pokemon = utils.findFirstWordInList(pokedex, text);
      if (_.isUndefined(pokemon)) {
        throw new errors.PokemonNotFoundError('No Pokémon found in text.');
      }
      return pokemon;
    });
}

// Due to some issue with Pokeapi, the "é" in "Pokémon" gets dropped.
// This is a quick hack to fix it until the issue is resolved.
function fixPokemonSpelling(text) {
  var rx = /pokmon/gi;
  var fixedText = text.replace(rx, function(match) {
    return match.slice(0, 3) + 'é' + match.slice(3);
  });
  return fixedText;
}

// Check cache for API call, call and save results otherwise.
function getCachedApiResource(endpoint, id) {
  var key = createCacheKey([endpoint, id]);
  return cache.getAsync(key)
    .then(function(resource) {
      if (resource) {
        return resource;
      }

      return pkmn.get(endpoint, id)
        .then(function(resource) {
          cache.setAsync(key, resource, 3600);
          return resource;
        });
    });
}

// Generate a unique cache key based on resource parameters.
function createCacheKey(values) {
  // NB: This assumes 0 is not a valid value, e.g. IDs start at 1.
  return _.compact(values).join('.');
}

module.exports = {
  getPokedex: getPokedex,
  getPokedexEntry: getPokedexEntry,
  utils: {
    getPokemonFromText: getPokemonFromText,
    fixPokemonSpelling: fixPokemonSpelling,
  },
};
