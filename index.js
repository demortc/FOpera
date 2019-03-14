const net = require('net');
const struct = require('python-struct');

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
    console.log(data.toString('ascii'))
    const decode = data.toString('ascii');
    console.log(decode.replace('@', '').split(/[^ -~]+/g).map(JSON.parse));
    const r = rl.createInterface({
      input: process.stdin,
    })
    r.on('line', (str) => {
      const response = JSON.stringify({type: 'Response', content: str});
      client2.write(struct.pack('!I', response.length));
      client2.write(response, 'ascii');
    })
      // console.log('Client1 received', JSON.parse(str.toString('ascii')));
  } catch {
    console.log('Client1 Error while parsing data')
  }
});


client2.on('data', (data) => {
  try {
    // const decode = data.toString('ascii');
    // console.log(decode.split('\r'));
  } catch {
    console.log('Client2 Error while parsing data')
  }
});

client2.on('error', (err) => {
  console.log(err)
})
