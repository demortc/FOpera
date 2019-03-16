"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const net = require('net');
const struct = require('python-struct');
const Tree = require("./tree");
const rl = require('readline');
const Parser = require('../utils/Parser');


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
    this.init = false;
  }

  listen() {
    this.client.on('data', (data) => {
      let index = 0;
      let elements = [];

      while (index + 4 < data.length) {
        const length = data.readInt32BE(index);

        index += 4;

        const sub = data.toString("ascii", index, length + index);

        index += length;
        
        try {
          elements.push(JSON.parse(sub));
        } catch (e) {
          try {
            elements.push(JSON.parse(data));
          } catch (e) {}
        }
      }

      elements.forEach((elem) => {
        this.parser.parseData(elem.content);
      })
    })  
  }

  calculatAnswer(question, informations) {
    if (question.type === "tuile_dispo") {
      return this.tree.goToBestChild(informations);
    } else if (question.type === "position_dispo") {
      return informations.indexOf(this.tree.getActualPos());
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