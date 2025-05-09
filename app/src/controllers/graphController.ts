import { Request, Response } from 'express';
import * as createVertexUseCase from '../services/createVertex';
import * as getVertexUseCase from '../services/getVertex';
import * as updateVertexUseCase from '../services/updateVertex';
import * as deleteVertexUseCase from '../services/deleteVertex';

import * as createEdgeUseCase from '../services/createEdge';
import * as getEdgeUseCase from '../services/getEdge';
import * as updateEdgeUseCase from '../services/updateEdge';
import * as deleteEdgeUseCase from '../services/deleteEdge';

import { logger } from '../logger/logs';

//
// ─── VERTEX CONTROLLERS ────────────────────────────────────────────────────────
//
export const createVertex = async (req: Request, res: Response) => {
  try {
    const result = await createVertexUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    logger.error('Create Vertex Error', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message || 'Failed to create vertex' });
  }
};

export const getVertex = async (req: Request, res: Response) => {
  try {
    const result = await getVertexUseCase.execute(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Get Vertex Error', { error });
    res.status(500).json({ error: 'Failed to retrieve vertex' });
  }
};

export const updateVertex = async (req: Request, res: Response) => {
  try {
    const result = await updateVertexUseCase.execute(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Update Vertex Error', { error });
    res.status(500).json({ error: 'Failed to update vertex' });
  }
};

export const deleteVertex = async (req: Request, res: Response) => {
  try {
    const result = await deleteVertexUseCase.execute(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Delete Vertex Error', { error });
    res.status(500).json({ error: 'Failed to delete vertex' });
  }
};

//
// ─── EDGE CONTROLLERS ──────────────────────────────────────────────────────────
//
export const createEdge = async (req: Request, res: Response) => {
  try {
    const result = await createEdgeUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    logger.error('Create Edge Error', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message || 'Failed to create edge' });
  }
};

export const getEdge = async (req: Request, res: Response) => {
  try {
    const result = await getEdgeUseCase.execute(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Get Edge Error', { error });
    res.status(500).json({ error: 'Failed to retrieve edge' });
  }
};

export const updateEdge = async (req: Request, res: Response) => {
  try {
    const result = await updateEdgeUseCase.execute(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Update Edge Error', { error });
    res.status(500).json({ error: 'Failed to update edge' });
  }
};

export const deleteEdge = async (req: Request, res: Response) => {
  try {
    const result = await deleteEdgeUseCase.execute(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Delete Edge Error', { error });
    res.status(500).json({ error: 'Failed to delete edge' });
  }
};
