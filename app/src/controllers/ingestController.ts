import { Request, Response } from 'express';
import { logger } from '../logger';
import client from '../db/gremlinCLient';

function sanitize(value: string): string {
  return value
    .replace(/\\/g, '')
    .replace(/"/g, '\"')
    .replace(/[\r\n]+/g, ' ');
}

export const ingestData = async (req: Request, res: Response) => {
  const { vertices = [], edges = [] } = req.body;

  if (!Array.isArray(vertices) || !Array.isArray(edges)) {
    logger.error('Invalid payload: missing or malformed vertices/edges');
    return res.status(400).json({ error: 'Payload must include arrays of vertices and edges.' });
  }

  try {
    for (const vertex of vertices) {
      const props = Object.entries(vertex.props || {})
        .filter(([key, value]) => key !== 'id' && typeof value === 'string' && !value.includes('{{') && value.trim() !== '')
        .map(([key, value]) => `.property('${key}', "${sanitize(String(value))}")`)
        .join('');

      const query = `g.addV('${vertex.label}')${props}`;
      logger.info(`Sending Gremlin query: ${query}`);
      await client.submit(query);
    }

    for (const edge of edges) {
      const props = Object.entries(edge.props || {})
        .filter(([_, value]) => typeof value === 'string' && !value.includes('{{') && value.trim() !== '')
        .map(([key, value]) => `.property('${key}', "${sanitize(String(value))}")`)
        .join('');

      const fromKey = sanitize(String(edge.fromKey || 'name'));
      const toKey = sanitize(String(edge.toKey || 'name'));
      const fromVal = sanitize(String(edge.fromVal));
      const toVal = sanitize(String(edge.toVal));

      const query = `g.V().has('${fromKey}', '${fromVal}').addE('${edge.label}').to(__.V().has('${toKey}', '${toVal}'))${props}`;
       logger.info(`Sending Gremlin edge query: ${query}`);
       await client.submit(query);
        await client.submit(query);
    
    }

    return res.status(200).json({ status: 'OK', received: { vertices: vertices.length, edges: edges.length } });
  } catch (error) {
    logger.error(`❌ JanusGraph ingestion failed`, error);
    return res.status(500).json({ error: 'Failed to ingest data' });
  }
};
