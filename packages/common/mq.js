import amqplib from 'amqplib';
import { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME, CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } from './config/index.js';

export { MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME, CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY };

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
    return channel
  } catch (err) {
    console.error('Error creating channel:', err);
    throw new Error('Failed to create channel');
  }
}

export const PublishMessage = async (channel, bindingKey, messageProp) => {
  try {
    const message = JSON.stringify(messageProp);
    console.log('Publishing message:', message, 'to binding key:', bindingKey);

    await channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message))
  } catch (err) {
    console.error('Error publishing message:', err);
    throw new Error('Failed to publish message');
  }
}

export const SubscribeToChannel = async (channel, bindingKey, callback) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);

  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, bindingKey);

  channel.consume(appQueue.queue, (data) => {
    callback(JSON.parse(data.content.toString()));
    channel.ack(data);
  });
}