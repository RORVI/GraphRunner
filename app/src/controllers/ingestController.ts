import { Request, Response } from 'express';
import { logger } from '../logger/logs';
import { handleIngestion } from '../services/ingestService';

export const ingestData = async (req: Request, res: Response) => {
  const { vertices = [], edges = [] } = req.body;

  if (!Array.isArray(vertices) || !Array.isArray(edges)) {
    logger.error('Invalid payload: missing or malformed vertices/edges');
    return res.status(400).json({ error: 'Payload must include arrays of vertices and edges.' });
  }

  try {
    await handleIngestion(vertices, edges);
    return res.status(200).json({ status: 'OK', received: { vertices: vertices.length, edges: edges.length } });
  } catch (error) {
    logger.error('❌ JanusGraph ingestion failed', error);
    return res.status(500).json({ error: 'Failed to ingest data' });
  }
};
