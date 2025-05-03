import { Request, Response } from 'express';
import * as createVertexUseCase from '../usecases/createVertex';
import * as getVertexUseCase from '../usecases/getVertex';
import * as updateVertexUseCase from '../usecases/updateVertex';
import * as deleteVertexUseCase from '../usecases/deleteVertex';
import { logger } from '../logger';

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