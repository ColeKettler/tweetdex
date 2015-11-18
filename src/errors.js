'use strict';

var util = require('util');

function createCustomError(name) {
  var E = function(message) {
    this.name = name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  };
  util.inherits(E, Error);

  return E;
}

var PokemonNotFoundError = createCustomError('PokemonNotFoundError');

module.exports = {
  createCustomError: createCustomError,
  PokemonNotFoundError: PokemonNotFoundError,
};
