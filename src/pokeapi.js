'use strict';

var _ = require('lodash');
var Pkmn = require('pkmn');
var cache = require('./cache');
var fixPokemonSpelling = require('./utils').fixPokemonSpelling;
var getRandomInt = require('./utils').getRandomInt;

var pkmn = new Pkmn();

// Retrieve a list of all Pokemon from the National Dex.
function getPokemonList() {
  return getPokedex().then(function(pokedex) {
    return pokedex.pokemon;
  });
}

function getPokedex() {
  return getCachedApiResource('pokedex');
}

// Look up a Pokemon on Pokeapi and return a random Pokedex entry.
function getPokedexEntry(name) {
  var descriptionLoading = getCachedApiResource('pokemon', name)
    .then(function(pokemon) {
      var descriptions = pokemon.descriptions;
      var r = getRandomInt(0, descriptions.length);
      var descriptionUri = descriptions[r].resource_uri;
      return getDescriptionId(descriptionUri);
    })
    .then(getDescription);
  return descriptionLoading;
}

function getDescription(id) {
  var descriptionLoading = getCachedApiResource('description', id)
    .then(function(description) {
      // Fix missing "é" in "Pokémon".
      var fixedDescription = fixPokemonSpelling(description.description);
      return fixedDescription;
    });
  return descriptionLoading;
}

function getDescriptionId(uri) {
  var rx = /description\/(\d+)\//;
  var match = rx.exec(uri);
  return match[1];
}

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

function createCacheKey(values) {
  // NB: This assumes 0 is not a valid value, e.g. IDs start at 1.
  return _.compact(values).join('.');
}

module.exports = {
  getPokedexEntry: getPokedexEntry,
  getPokemonList: getPokemonList,
};
