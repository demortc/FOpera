const { Tuile } = require('../utils');

const CharactersString = [
  "rouge",
  "rose",
  "gris",
  "bleu",
  "violet",
  "marron",
  "noir",
  "blanc",
]

const Color = {
  RED:0,
  PINK:1,
  GREY:2,
  BLUE:3,
  PURPLE:4,
  BROWN:5,
  BLACK:6,
  WHITE:7,
  NONE:8,
}

class Character {
  constructor(_color, _position, _suspect) {
    this.color = _color;
    this.position = _position;
    this.suspect = _suspect;
  }

  dump() {
    console.log(" ", this.color,", position: ",this.position,", suspect: ", this.suspect)
  }

  get_character_color_to_string() {
    return CharactersString[this.color];
  }

  convert_from_tile_color(tileColor) {
    const conversion = [
      [Color.RED, Tuile.Color.rouge],
      [Color.PINK, Tuile.Color.rose],
      [Color.GREY, Tuile.Color.gris],
      [Color.BLUE, Tuile.Color.bleu],
      [Color.PURPLE, Tuile.Color.violet],
      [Color.BROWN, Tuile.Color.marron],
      [Color.BLACK, Tuile.Color.noir],
      [Color.WHITE, Tuile.Color.blanc]
    ];
    return conversion.find(c => c[1] === tileColor)[0];
  }
};

module.exports = Character;