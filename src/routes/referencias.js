// routes/referencias.js
const { Router } = require('express');
const ReferenciaController = require('../controllers/ReferenciaController');

const router = Router();

/**
 * @swagger
 * /referencias:
 *   get:
 *     summary: Obtiene la lista de todas las referencias
 *     description: Retorna un array con todas las referencias registradas en la base de datos
 *     tags: [Referencias]
 *     responses:
 *       200:
 *         description: Lista de referencias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referencia'
 *       500:
 *         description: Error del servidor
 */
router.get('/referencias', ReferenciaController.obtenerTodasReferencias);

/**
 * @swagger
 * /referencia/{id_referencia}:
 *   get:
 *     summary: Obtiene una referencia por su ID
 *     description: Retorna los datos de una referencia específica según su ID
 *     tags: [Referencias]
 *     parameters:
 *       - in: path
 *         name: id_referencia
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la referencia
 *     responses:
 *       200:
 *         description: Datos de la referencia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referencia'
 *       404:
 *         description: Referencia no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/referencia/:id_referencia', ReferenciaController.obtenerReferenciaPorId);

/**
 * @swagger
 * /nueva-referencia:
 *   post:
 *     summary: Crea una nueva referencia
 *     description: Crea un nuevo registro de referencia en la base de datos
 *     tags: [Referencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_colaborador
 *               - id_microempresario
 *             properties:
 *               id_colaborador:
 *                 type: string
 *                 description: ID del colaborador que hace la referencia
 *               id_microempresario:
 *                 type: string
 *                 description: ID del microempresario referido
 *     responses:
 *       201:
 *         description: Referencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Referencia creada exitosamente
 *                 id_referencia:
 *                   type: string
 *                   example: ref123
 *       500:
 *         description: Error al crear la referencia
 */
router.post('/nueva-referencia', ReferenciaController.crearReferencia);

/**
 * @swagger
 * /actualizar-referencia/{id_referencia}:
 *   put:
 *     summary: Actualiza el estado de una referencia
 *     description: Actualiza el estado de una referencia existente y añade el nuevo estado al historial
 *     tags: [Referencias]
 *     parameters:
 *       - in: path
 *         name: id_referencia
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la referencia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado_referencia
 *             properties:
 *               estado_referencia:
 *                 type: string
 *                 description: Nuevo estado de la referencia (pendiente, contactado, confirmado, etc.)
 *     responses:
 *       200:
 *         description: Referencia actualizada exitosamente
 *       404:
 *         description: Referencia no encontrada
 *       500:
 *         description: Error al actualizar la referencia
 */
router.put('/actualizar-referencia/:id_referencia', ReferenciaController.actualizarReferenciaEstado);

/**
 * @swagger
 * /eliminar-referencia/{id_referencia}:
 *   delete:
 *     summary: Elimina una referencia
 *     description: Elimina una referencia de la base de datos según su ID
 *     tags: [Referencias]
 *     parameters:
 *       - in: path
 *         name: id_referencia
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la referencia a eliminar
 *     responses:
 *       200:
 *         description: Referencia eliminada exitosamente
 *       404:
 *         description: Referencia no encontrada
 *       500:
 *         description: Error al eliminar la referencia
 */
router.delete('/eliminar-referencia/:id_referencia', ReferenciaController.eliminarReferencia);

/**
 * @swagger
 * components:
 *   schemas:
 *     Referencia:
 *       type: object
 *       required:
 *         - id_referencia
 *         - id_colaborador
 *         - id_microempresario
 *         - estado_referencia
 *         - fecha_referencia
 *         - historial_estados
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_referencia:
 *           type: string
 *           description: ID único de la referencia
 *         id_colaborador:
 *           type: string
 *           description: ID del colaborador que hace la referencia
 *         id_microempresario:
 *           type: string
 *           description: ID del microempresario referido
 *         estado_referencia:
 *           type: string
 *           description: Estado actual de la referencia (pendiente, contactado, confirmado, etc.)
 *         fecha_referencia:
 *           type: string
 *           format: date
 *           description: Fecha en que se creó la referencia
 *         historial_estados:
 *           type: array
 *           description: Historial de los estados por los que ha pasado la referencia
 *           items:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 description: Estado de la referencia
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha en que se actualizó al estado
 */

module.exports = router;