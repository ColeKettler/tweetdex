'use strict';

var _ = require('lodash');

// Get random integer between min and max (exclusive).
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

// Split text into words (ignoring hyphens), and return first word that occurs
// in the list.
function findFirstWordInList(list, txt) {
  var words = _.words(txt, /[-\w]+/g);
  var result = _.find(words, function(word) {
    return _.includes(list, word);
  });
  return result;
}

// Truncate a string to less than max chars long, split at last word boundary.
function truncateAtWord(str, max) {
  var trunc = str.slice(0, max);
  if (trunc.length < str.length) {
    trunc = trunc.slice(0, trunc.lastIndexOf(' '));
  }
  return trunc;
}

module.exports = {
  findFirstWordInList: findFirstWordInList,
  getRandomInt: getRandomInt,
  retry: retry,
  truncateAtWord: truncateAtWord,
};
