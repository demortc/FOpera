const { Character, CharactersString} = require('../player/Character');

const State = {
  unknow: 0, // Unknown line
  stars: 1, // *****************
  worldInfo:2, //Tour: 1, Score: 4/22
  characterPos:3, //bleu-3-suspect rouge-6-clean [...]
  questionPower:4, //QUESTION : Voulez-vous activer le pouvoir (0/1) ?
  question:5, // QUESTION : [...]
  answerGiven:6, //REPONSE DONNEE : [...]
  answerUnderstood:7, //REPONSE INTERPRETEE : [...]
  characterPlayed:8, //[le fantome / l'inspecteur] a joue [bleu/rouge/etc...]
  powerPlayed:9, //Pouvoir de [couleur] active
  ghostState:10, //pas de cri / le fantome a frappe
  newPlacement:11, //NOUVEAU PLACEMENT : couleur-pos-suspect/clean
  inspectorTurn:12, //Le tour de l'inspecteur
  ghostTurn:13, //Le tour de le fantome
  ghostCharacter:14, // !!! le fantôme est : [couleur]
  smallStars:15 // ****
}

class Parser {
  constructor (playerId) {
    this.playerId = playerId;
    this.state = State.unknow;
    this.ghostColor = Character.Color.NONE,
    this.isGhostTurn = false,
    this.lastPlayedCharacter = undefined,
    this.characters = [
      new Character(Character.Color.RED, 0, true),
      new Character(Character.Color.PINK, 0, true),
      new Character(Character.Color.GREY, 0, true),
      new Character(Character.Color.BLUE, 0, true),
      new Character(Character.Color.PURPLE, 0, true),
      new Character(Character.Color.BROWN, 0, true),
      new Character(Character.Color.BLACK, 0, true),
      new Character(Character.Color.WHITE, 0, true),
    ],
    this.lock = [undefined, undefined],
    this.light = 0;
  }

  RegToAction() {
    return {
      // stars: {
      //   reg: /[*]{26}/,
      //   act: () => {}
      // },
      worldInfo: {
        reg: /Tour:./,
        act:(line) => this.initWorldInfo(line),
      },
      characterPos: {
        reg: /^([a-z]+-[0-9]-(suspect|clean)(  |)){8}/,
        act: (line) => this.initCharacters(line),
      },
      questionPower: {
        reg: /^QUESTION : Voulez-vous activer le pouvoir \(0\/1\) \?$/,
        act: () => {},
      },
      question: {
        reg: /QUESTION :./,
        act:() => {}
      },
      answerGiven: {
        reg: /REPONSE DONNEE./,
        act:() => {},
      },
      answerUnderstood: {
        reg: /REPONSE INTERPRETEE./,
        act:() => {},
      },
      character_played: {
        reg: /l(e fantome|\'inspecteur) joue/,
        act:() => {},
      },
      powerPlayed: {
        reg: /Pouvoir de [a-z]+ activé/,
        act:() => {},
      },
      ghostState: {
        reg: /(le fantome frappe|pas de cri)/,
        act:() => {},
      },
      newPlacement: {
        reg: /NOUVEAU PLACEMENT : [a-z]+-[0-9]-(suspect|clean)/,
        act: (line) => this.parseNewPosition(line),
      },
      inspectorTurn: {
        reg: /^  Tour de l\'inspecteur/,
        act: () => this.isGhostTurn = false,
      },
      ghostTurn: {
        reg: /  Tour de le fantome/,
        act:() => this.isGhostTurn = true,
      },
      ghostCharacter: {
        reg: /[!]{3}./,
        act:(line) => this.parseGhostColor(line)
      },
      // smallStars: {
      //   reg: /[*]{4}/,
      //   act: () => {},
      // }  
    }
  }

  parseData(line) {
    for (let key in this.RegToAction()) {
      if (line.search(this.RegToAction()[key].reg)){
        this.RegToAction()[key].act(line);
      }
    }
  }

  initCharacters(line) {
    console.log("INIT POS", line)
  }

  parseGhostColor(line) {
    try {
      const lineColor = line.split(':')[1].trim();
      for (let color in CharactersString) {
        if (CharactersString[color] == lineColor) {
          this.ghostColor = color;
          break;
        }
      }
    } catch(e) {
      console.log(e + ' in line ' + line)
    }
  }

  parseNewPosition(line) {
    try {
      let data = line.split(':')[1].trim();
      data = data.split('-');
      const charIndex = CharactersString.indexOf(data[0])
      this.lastPlayedCharacter = new Character(charIndex, Number(data[1]), data[2] === 'suspect' ? true: false);  
    } catch (e) {
      console.log(e + ' in line ' + line)
    }
  }

  initWorldInfo(line) {
    try {
      this.light = line.charAt(line.indexOf('Ombre') + 6);
      this.lock[0] = line.charAt(line.indexOf('Bloque') + 8)
      this.lock[1] = line.charAt(line.indexOf('Bloque') + 11)
    } catch (e) {
      console.log(e + ' in line ' + line)
    }
  }
}

module.exports = Parser;
