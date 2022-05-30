import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listener/order-cancelled-listener';
import { OrderCreatedListener } from './events/listener/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  [
    'JWT_KEY',
    'MONGO_URI',
    'NATS_CLIENT_ID',
    'NATS_URL',
    'NATS_CLUSTER_ID',
  ].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} must be defined`);
    }
  });

  try {
    await natsWrapper.connect({
      clusterId: process.env.NATS_CLUSTER_ID!,
      clientId: process.env.NATS_CLIENT_ID!,
      url: process.env.NATS_URL!,
    });

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Tickets listening on port 3000!');
  });
};

start();
