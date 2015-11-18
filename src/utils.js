'use strict';

var _ = require('lodash');

// Due to some issue with Pokeapi, the "é" in "Pokémon" gets dropped.
// This is a quick hack to fix it until the issue is resolved.
function fixPokemonSpelling(text) {
  var rx = /pokmon/gi;
  var fixedText = text.replace(rx, function(match) {
    return match.slice(0, 3) + 'é' + match.slice(3);
  });
  return fixedText;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Retry a promise-returning function a set number of times, default 1.
// Inspired by Jacob (http://stackoverflow.com/a/30471209/2267428).
function retry(func, maxRetries) {
  maxRetries = _.isUndefined(maxRetries) ? 1 : maxRetries;
  return func().catch(function(err) {
    if (maxRetries <= 0) {
      throw err;
    }
    return retry(func, maxRetries - 1);
  });
}

function truncateAtWord(str, max) {
  var trunc = str.slice(0, max);
  if (trunc.length < str.length) {
    trunc = trunc.slice(0, trunc.lastIndexOf(' '));
  }
  return trunc;
}

module.exports = {
  fixPokemonSpelling: fixPokemonSpelling,
  getRandomInt: getRandomInt,
  retry: retry,
  truncateAtWord: truncateAtWord,
};
