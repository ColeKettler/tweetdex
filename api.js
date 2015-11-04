var Pkmn = require('pkmn');
var fixPokemonSpelling = require('./utils').fixPokemonSpelling;
var getRandomInt = require('./utils').getRandomInt;

var pkmn = new Pkmn();

// Look up a Pokemon on Pokeapi and return a random Pokedex entry.
function getPokedexEntry(name) {
  var descriptionLoading = pkmn.get('pokemon', name)
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
  var descriptionLoading = pkmn.get('description', id)
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

module.exports = {
  getPokedexEntry: getPokedexEntry,
};
