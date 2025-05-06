import { driver } from 'gremlin';

const gremlinEndpoint = 'ws://localhost:8182/gremlin';
const traversalSource = 'g';
const mimeType = 'application/vnd.gremlin-v3.0+json';

const client = new driver.Client(gremlinEndpoint, {
  traversalSource,
  mimeType,
  maxConcurrentRequests: 64,
  pingEnabled: true,
});

client.open().catch((err) => {
  console.error('Initial Gremlin client connection failed:', err);
});

export default client;