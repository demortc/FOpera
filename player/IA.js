"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const net = require('net');
const struct = require('python-struct');

class IA {
  constructor(playerId, port = 15555, host = 'localhost') {
    this.player = playerId;
    this.client = new net.Socket();
    this.client.connect(port, host, () => {
      console.log('IA Client connected to server');
      this.listen();
    })
  }

  listen() {
    this.client.on('data', (data) => {
      let index = 0;
      let elements = [];

      while (index + 4 < data.length) {
        const length = data.readInt32BE(index);

        index += 4;

        const sub = data.toString("ascii", index, length + index);

        if (!sub || sub.length < 2) {
          index = index + sub.length;
          break;
        }

        index += length;

        elements.push(JSON.parse(sub));
      }

      elements.forEach((elem) => {
        if (elem.type === "Question") {
          console.log(" ????? ")
        }

        console.log(elem.content);
      })
    })  
  }

  respond(str) {
    const response = JSON.stringify({type: 'Response', content: str});
    this.client.write(struct.pack('!I', response.length));
    this.client.write(response, 'ascii');
  }

  revcall(buff, count) {

  }

}

module.exports = IA;