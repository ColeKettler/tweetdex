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
  truncateAtWord: truncateAtWord,
}
