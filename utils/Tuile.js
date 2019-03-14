class Tuile {
  constructor (color , status = undefined, position = undefined) {
    this.color = color;
    this.position = position;
    this.status = status;

  }

  static get Status() {
    return {
      clean: 0,
      suspect: 1,
    }
  }

  static get Color()  {
    return {
      rose:1,
      gris:2,
      rouge:3,
      marron:4,
      bleu:5,
      violet:6,
      blanc:7,
      noir:8,
    };
  }

  get color() {
    return this.color;
  }

  get position() {
    return this.position;
  }

  set position(position) {
    this.position = position;
  }

  get status() {
    return this.status;
  }

  set status(status) {
    this.status = status;
  }
}
module.exports = Tuile;


