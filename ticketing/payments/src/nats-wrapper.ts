import nats, { Stan } from 'node-nats-streaming';

interface NatsProperties {
  clusterId: string;
  clientId: string;
  url: string;
}

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS Client before connecting');
    }

    return this._client;
  }

  connect(natsProperties: NatsProperties): Promise<void> {
    const { clusterId, clientId, url } = natsProperties;
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this._client!.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
