import { Router } from 'express';
import * as graphController from '../controllers/graphController';

const router = Router();

/**
 * @openapi
 * /api/vertex:
 *   post:
 *     summary: Create a new vertex
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               label:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/vertex', graphController.createVertex);

/**
 * @openapi
 * /api/vertex/{id}:
 *   get:
 *     summary: Get a vertex by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Vertex found
 */
router.get('/vertex/:id', graphController.getVertex);

/**
 * @openapi
 * /api/vertex/{id}:
 *   put:
 *     summary: Update a vertex by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *     responses:
 *       200:
 *         description: Vertex updated
 */
router.put('/vertex/:id', graphController.updateVertex);

/**
 * @openapi
 * /api/vertex/{id}:
 *   delete:
 *     summary: Delete a vertex by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Vertex deleted
 */
router.delete('/vertex/:id', graphController.deleteVertex);

export default router;