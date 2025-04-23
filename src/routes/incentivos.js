const { Router } = require('express');
const incentivoController = require('../controllers/incentivoController');

const router = Router();

/**
 * @swagger
 * /nuevo-incentivo:
 *   post:
 *     summary: Crea un nuevo incentivo
 *     description: Crea un nuevo registro de incentivo en la base de datos
 *     tags: [Incentivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del incentivo
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada del incentivo
 *     responses:
 *       201:
 *         description: Incentivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Incentivo creado exitosamente
 *                 id_incentivo:
 *                   type: string
 *                   example: me123
 *       500:
 *         description: Error al crear el incentivo
 */
router.post('/nuevo-incentivo', incentivoController.crear);

/**
 * @swagger
 * /incentivos:
 *   get:
 *     summary: Obtiene la lista de todos los incentivos
 *     description: Retorna un array con todos los incentivos registrados en la base de datos
 *     tags: [Incentivos]
 *     responses:
 *       200:
 *         description: Lista de incentivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Incentivo'
 *       500:
 *         description: Error del servidor
 */
router.get('/incentivos', incentivoController.obtenerTodos);

/**
 * @swagger
 * components:
 *   schemas:
 *     Incentivo:
 *       type: object
 *       required:
 *         - id_incentivo
 *         - titulo
 *         - descripcion
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_incentivo:
 *           type: string
 *           description: ID único del incentivo
 *         titulo:
 *           type: string
 *           description: Título del incentivo
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del incentivo
 */

module.exports = router;