const net = require('net');

const rl = require('readline');

const client1 = new net.Socket();
const client2 = new net.Socket();

client1.connect(15555, "10.38.165.60", () => {
  console.log('Client 1 connected to server')
});

client2.connect(15555, "10.38.165.60", () => {
  console.log('Client 2 connected to server')
});


client1.on('data', (data) => {
  try {
    const decode = data.toString('ascii');
    console.log(decode.replace('@', '').split(/[^ -~]+/g).map(JSON.parse));
      // console.log('Client1 received', JSON.parse(str.toString('ascii')));
  } catch {
    console.log('Client1 Error while parsing data')
  }
});


client2.on('data', (data) => {
  try {
    const decode = data.toString('ascii');
    console.log(decode.split('\r'));
  } catch {
    console.log('Client2 Error while parsing data')
  }
});
