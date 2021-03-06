"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const net = require('net');
const Tree = require("./tree");
const {Parser, State} = require('../utils/Parser');


class IA {
  constructor(playerId, port = 15555, host = 'localhost') {
    this.player = playerId;
    this.client = new net.Socket();
    this.client.connect(port, host, () => {
      console.log('IA Client connected to server');
      this.listen();
    });
    this.tree = new Tree();
    this.tree.generate();
    this.parser = new Parser(playerId);
  }

  listen() {
    this.client.on('data', (data) => {
      let index = 0;
      let elements = [];

      try {
        while (index + 4 < data.length) {
          const length = data.readInt32BE(index);

          index += 4;

          const sub = data.toString("ascii", index, length + index);

          index += length;

          try {
            elements.push(JSON.parse(sub));
          }
          catch (e) {
            try {
              elements.push(JSON.parse(data));
            }
            catch (e) {
            }
          }
        }

        elements.forEach((elem) => {
          console.log(elem.content);
          this.parser.parseData(elem.content, (value) => {
            if (value) {
              this.respond(this.calculatAnswer(value));
            } else {

              if (this.parser.state === State.worldInfo) {
                if (this.parser.init) {
                  this.tree.updateWorldInfo(this.parser.lock, this.parser.light)    
                }
                this.tree.root.lightOff = this.parser.light;
                this.tree.root.lock = this.parser.lock;
              }
              if (this.parser.state === State.characterPos) {
                if (this.parser.init) {
                  this.tree.updateSuspectWorld(this.parser.characters);
                } else {
                  this.tree.root.characters = this.parser.characters;
                }
              }
              if (this.parser.state === State.ghostCharacter) {
                this.tree.root.ghostColor = this.parser.ghostColor;
              }
              if (this.parser.state === State.newPlacement) {
                this.tree.goToAdverseMove(this.parser.lastPlayedCharacter);
              }
              
            }
          });
        })
      } catch (e) {
        console.error(e);
      }
    })
  }

  calculatAnswer(question) {
    if (question.type === "TUILES") {
      return this.tree.goToBestChild(question.values);
    } else if (question.type === "POSITION") {
      const pos =  question.values.find((val) => val === this.tree.getActualPos());

      return pos > 0 && pos < 9 ? pos : question.values[0];
    } else if (question.type === "POWER") {
      return 1;
    } else {
      return 0;
    }
  }

  respond(str) {
    const response = JSON.stringify({type: 'Response', content: str});
    const lenght = Buffer.allocUnsafe(4);
    lenght.writeInt32BE(response.length);

    this.client.write(Buffer.concat([lenght, Buffer.from(response, "ascii")], 4 + response.length));
  }
}

module.exports = IA;