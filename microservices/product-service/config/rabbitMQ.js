const amqp = require('amqplib');
const { decreaseQuantityFromQueue } = require('../controllers/productController')

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // Declare the queue
        const queue = 'deduct_quantity';
        await channel.assertQueue(queue, { durable: true });

        console.log(`Waiting for messages in ${queue}`);
        channel.consume(queue, async (message) => {
            if (message !== null) {
                const data = JSON.parse(message.content.toString());
                console.log("Received:", data);

                // Deduct product quantity in your database
                const success = await decreaseQuantityFromQueue(data.product_id, data.variant_id, data.quantity);
                
                if (success) {
                    channel.ack(message); // Acknowledge the message
                } else {
                    console.error("Failed to deduct product quantity");
                }
            }
        });
    } catch (error) {
        console.error("RabbitMQ connection error:", error);
    }
};

module.exports = connectRabbitMQ;

