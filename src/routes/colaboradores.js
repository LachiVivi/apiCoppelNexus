const { Router } = require('express');
const colaboradorController = require('../controllers/colaboradorController');

const router = Router();

/**
 * @swagger
 * /colaboradores:
 *   get:
 *     summary: Obtiene la lista de todos los colaboradores
 *     description: Retorna un array con todos los colaboradores registrados en la base de datos
 *     tags: [Colaboradores]
 *     responses:
 *       200:
 *         description: Lista de colaboradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Colaborador'
 *       500:
 *         description: Error del servidor
 */
router.get('/colaboradores', colaboradorController.obtenerTodos);

/**
 * @swagger
 * /nuevo-colaborador:
 *   post:
 *     summary: Crea un nuevo colaborador
 *     description: Crea un nuevo registro de colaborador en la base de datos
 *     tags: [Colaboradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - numero_empleado
 *               - zona_actual
 *               - contrasenia
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del colaborador
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del colaborador
 *               numero_empleado:
 *                 type: string
 *                 description: Número único de empleado
 *               zona_actual:
 *                 type: string
 *                 description: Zona donde trabaja el colaborador
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del colaborador
 *               foto_perfil_url:
 *                 type: string
 *                 description: URL de la foto de perfil
 *     responses:
 *       201:
 *         description: Colaborador creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Colaborador creado exitosamente
 *                 id_colaborador:
 *                   type: string
 *                   example: col123
 *       500:
 *         description: Error al crear el colaborador
 */
router.post('/nuevo-colaborador', colaboradorController.crear);

/**
 * @swagger
 * /colaborador/{numero_empleado}:
 *   get:
 *     summary: Obtiene un colaborador por su número de empleado
 *     description: Retorna los datos de un colaborador específico según su número de empleado
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: path
 *         name: numero_empleado
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de empleado del colaborador
 *     responses:
 *       200:
 *         description: Datos del colaborador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colaborador'
 *       404:
 *         description: Colaborador no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/colaborador/:numero_empleado', colaboradorController.obtenerPorNumeroEmpleado);

/**
 * @swagger
 * /actualizar-colaborador/{numero_empleado}:
 *   put:
 *     summary: Actualiza los datos de un colaborador
 *     description: Actualiza la información de un colaborador existente identificado por su número de empleado
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: path
 *         name: numero_empleado
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de empleado del colaborador a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               nuevo_numero_empleado:
 *                 type: string
 *               zona_actual:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               foto_perfil_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Colaborador actualizado exitosamente
 *       404:
 *         description: Colaborador no encontrado
 *       500:
 *         description: Error al actualizar el colaborador
 */
router.put('/actualizar-colaborador/:numero_empleado', colaboradorController.actualizar);

/**
 * @swagger
 * /eliminar-colaborador/{numero_empleado}:
 *   delete:
 *     summary: Elimina un colaborador
 *     description: Elimina un colaborador de la base de datos según su número de empleado
 *     tags: [Colaboradores]
 *     parameters:
 *       - in: path
 *         name: numero_empleado
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de empleado del colaborador a eliminar
 *     responses:
 *       200:
 *         description: Colaborador eliminado exitosamente
 *       404:
 *         description: Colaborador no encontrado
 *       500:
 *         description: Error al eliminar el colaborador
 */
router.get('/eliminar-colaborador/:numero_empleado', colaboradorController.eliminar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Colaborador:
 *       type: object
 *       required:
 *         - id_colaborador
 *         - nombre
 *         - apellidos
 *         - numero_empleado
 *         - zona_actual
 *         - contrasenia
 *         - fecha_registro
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_colaborador:
 *           type: string
 *           description: ID único del colaborador
 *         nombre:
 *           type: string
 *           description: Nombre del colaborador
 *         apellidos:
 *           type: string
 *           description: Apellidos del colaborador
 *         numero_empleado:
 *           type: string
 *           description: Número único de empleado
 *         zona_actual:
 *           type: string
 *           description: Zona donde trabaja el colaborador
 *         contrasenia:
 *           type: string
 *           description: Contraseña del colaborador
 *         fecha_registro:
 *           type: string
 *           format: date
 *           description: Fecha en que se registró el colaborador
 *         foto_perfil_url:
 *           type: string
 *           description: URL de la foto de perfil
 *         incentivos_canjeados:
 *           type: array
 *           description: Lista de incentivos canjeados por el colaborador
 *           items:
 *             type: object
 *         registro_actividades:
 *           type: array
 *           description: Registro de actividades del colaborador
 *           items:
 *             type: object
 *         notificaciones:
 *           type: array
 *           description: Notificaciones enviadas al colaborador
 *           items:
 *             type: object
 *         rutas:
 *           type: array
 *           description: Rutas asignadas al colaborador
 *           items:
 *             type: object
 */

module.exports = router;