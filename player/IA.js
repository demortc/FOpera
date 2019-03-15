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

      while (index < data.length) {
        const length = data.readUInt32BE(index);

        console.log("index=" + this.player + "=" + index);
        console.log("lenght=" + this.player + "=" + length);

        const sub = data.toString("ascii", index + 4, length + 4);

        if (!sub || sub.length === 0) {
          break;
        }

        console.log(this.player + "=" + sub);
        elements.push(sub);
        index += length + 4;
      }
      //console.log(decode.replace('@', '').split(/[^ -~]+/g));
      // PARSE THE DECODE RESPONSE HERE

    })  
  }

  respond(str) {
    const response = JSON.stringify({type: 'Response', content: str});
    this.client.write(struct.pack('!I', response.length));
    this.client.write(response, 'ascii');
  }

}

module.exports = IA;