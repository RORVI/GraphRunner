import { driver } from 'gremlin';
import dotenv from 'dotenv';

dotenv.config();

let client: any;

export function getGremlinClient() {
  if (!client) {
    const gremlinEndpoint = `ws://${process.env.GREMLIN_HOST || 'localhost'}:${process.env.GREMLIN_PORT || 8182}/gremlin`;
    const traversalSource = process.env.GREMLIN_TRAVERSAL_SOURCE || 'g';
    const mimeType = process.env.GREMLIN_MIMETYPE || 'application/vnd.gremlin-v3.0+json';

    client = new driver.Client(gremlinEndpoint, {
      traversalSource,
      mimeType,
      maxConcurrentRequests: 64,
      pingEnabled: true,
    });

    client.open()
      .then(() => console.log(`✅ Gremlin client connected to ${gremlinEndpoint}`))
      .catch((err: { message: any; }) => console.error('❌ Gremlin client connection failed:', err.message));
  }

  return client;
}
