const net = require('net');
const struct = require('python-struct');

class IA {
  constructor(playerId, port = 15555, host = 'localhost') {
    this.client = new net.Socket();
    this.client.connect(port, host, () => {
      console.log('IA Client connected to server');
      this.listen();
    })
  }

  listen = () => {
    this.client.on('data', (data) => {
      let decode = data.toString('ascii');
      decode.replace('@', '').split(/[^ -~]+/g).map(JSON.parse);
      // PARSE THE DECODE RESPONSE HERE

    })  
  }

  respond = (str) => {
    const response = JSON.stringify({type: 'Response', content: str});
    this.client.write(struct.pack('!I', response.length));
    this.client.write(response, 'ascii');
  }

}

module.exports = IA;