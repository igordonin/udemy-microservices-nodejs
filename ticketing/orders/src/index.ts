import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('starting up...');

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

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Orders listening on port 3000!');
  });
};

start();
