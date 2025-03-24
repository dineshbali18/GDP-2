// const Redis = require('ioredis');

// const redisPublisher = new Redis({
//   host: '10.10.104.248',  // Change if using a remote Redis server
//   port: 7000
// });

// const redisSubscriber = new Redis({
//     host: '10.10.104.248',  // Change if using a remote Redis server
//     port: 7000
//   });

//   redisPublisher.on('connect', () => console.log('Redis Publisher connected'));
//   redisSubscriber.on('connect', () => console.log('Redis Subscriber connected'));
  
//   // Handle Redis errors
//   redisPublisher.on('error', (err) => console.error('Redis Publisher error:', err));
//   redisSubscriber.on('error', (err) => console.error('Redis Subscriber error:', err));
  
//   module.exports = { redisPublisher, redisSubscriber };

