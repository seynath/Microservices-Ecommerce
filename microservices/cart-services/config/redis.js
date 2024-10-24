const { createClient } = require('redis');

// Create a Redis client with authentication and connection settings
const client = createClient({
    password: 'HnDhpQFnfu26KBynCvF08nYNh97nHqo2',
    socket: {
        host: 'redis-19480.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 19480
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
