const net = require('net');

const client = new net.Socket();

client.connect(15555, "172.20.10.2", (error, res) => {
  console.log(error, res)
});