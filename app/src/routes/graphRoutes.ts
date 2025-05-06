import { Router } from 'express';
import * as graphController from '../controllers/graphController';

const router = Router();

// ────── Vertex Routes ──────

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
 *         required: true
 *         schema:
 *           type: string
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
 *         required: true
 *         schema:
 *           type: string
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
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vertex deleted
 */
router.delete('/vertex/:id', graphController.deleteVertex);

// ────── Edge Routes ──────

/**
 * @openapi
 * /api/edge:
 *   post:
 *     summary: Create a new edge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               fromKey:
 *                 type: string
 *               fromVal:
 *                 type: string
 *               toKey:
 *                 type: string
 *               toVal:
 *                 type: string
 *               props:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Edge created
 */
router.post('/edge', graphController.createEdge);

/**
 * @openapi
 * /api/edge/{id}:
 *   get:
 *     summary: Get an edge by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edge found
 */
router.get('/edge/:id', graphController.getEdge);

/**
 * @openapi
 * /api/edge/{id}:
 *   put:
 *     summary: Update an edge by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Edge updated
 */
router.put('/edge/:id', graphController.updateEdge);

/**
 * @openapi
 * /api/edge/{id}:
 *   delete:
 *     summary: Delete an edge by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edge deleted
 */
router.delete('/edge/:id', graphController.deleteEdge);

export default router;
