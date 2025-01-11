const { createClient } = require('redis');

// Create a Redis client with authentication and connection settings
const client = createClient({
    username: 'default',
    password: 'v1yFoPECm2AGgFiHITSr9gf3D07qa6N2',
    socket: {
        host: 'redis-11971.c100.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 11971
    }
});

// Handle errors
client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

// Connect to Redis
const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis', err);
    }
};

// Export the Redis client and connection function
module.exports = { client, connectRedis };


// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: 'v1yFoPECm2AGgFiHITSr9gf3D07qa6N2',
//     socket: {
//         host: 'redis-11971.c100.us-east-1-4.ec2.redns.redis-cloud.com',
//         port: 11971
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

