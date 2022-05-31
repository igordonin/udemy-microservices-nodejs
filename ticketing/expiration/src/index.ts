import { natsWrapper } from './nats-wrapper';

const start = async () => {
  ['NATS_CLIENT_ID', 'NATS_URL', 'NATS_CLUSTER_ID'].forEach((key) => {
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
  } catch (err) {
    console.log(err);
  }
};

start();
