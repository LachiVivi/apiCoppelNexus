const { Router } = require('express');
const administradorController = require('../controllers/administradorController');

const router = Router();

/**
 * @swagger
 * /administradores:
 *   get:
 *     summary: Obtiene la lista de todos los administradores
 *     description: Retorna un array con todos los administradores registrados en la base de datos
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Administrador'
 *       500:
 *         description: Error del servidor
 */
router.get('/administradores', administradorController.obtenerTodos);

/**
 * @swagger
 * /administrador/{id_admin}:
 *   get:
 *     summary: Obtiene un administrador por su ID
 *     description: Retorna los datos de un administrador específico según su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id_admin
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Datos del administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrador'
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/administrador/:id_admin', administradorController.obtenerPorId);

/**
 * @swagger
 * /nuevo-administrador:
 *   post:
 *     summary: Crea un nuevo administrador
 *     description: Crea un nuevo registro de administrador en la base de datos
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - correo_institucional
 *               - numero_empleado
 *               - rol_admin
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del administrador
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del administrador
 *               correo_institucional:
 *                 type: string
 *                 description: Correo institucional del administrador
 *               numero_empleado:
 *                 type: string
 *                 description: Número de empleado
 *               rol_admin:
 *                 type: string
 *                 description: Rol del administrador en el sistema
 *     responses:
 *       201:
 *         description: Administrador creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Administrador creado exitosamente
 *                 id_admin:
 *                   type: string
 *                   example: admin123
 *       500:
 *         description: Error al crear el administrador
 */
router.post('/nuevo-administrador', administradorController.crear);

/**
 * @swagger
 * /actualizar-administrador/{id_admin}:
 *   put:
 *     summary: Actualiza un administrador
 *     description: Actualiza los datos de un administrador existente
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id_admin
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del administrador a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del administrador
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del administrador
 *               correo_institucional:
 *                 type: string
 *                 description: Correo institucional del administrador
 *               numero_empleado:
 *                 type: string
 *                 description: Número de empleado
 *               rol_admin:
 *                 type: string
 *                 description: Rol del administrador en el sistema
 *               estado:
 *                 type: string
 *                 description: Estado del administrador (activo, inactivo)
 *     responses:
 *       200:
 *         description: Administrador actualizado exitosamente
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error al actualizar el administrador
 */
router.put('/actualizar-administrador/:id_admin', administradorController.actualizar);

/**
 * @swagger
 * /eliminar-administrador/{id_admin}:
 *   delete:
 *     summary: Elimina un administrador
 *     description: Elimina un administrador de la base de datos según su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id_admin
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del administrador a eliminar
 *     responses:
 *       200:
 *         description: Administrador eliminado exitosamente
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error al eliminar el administrador
 */
router.delete('/eliminar-administrador/:id_admin', administradorController.eliminar);

/**
 * @swagger
 * components:
 *   schemas:
 *     Administrador:
 *       type: object
 *       required:
 *         - id_admin
 *         - nombre
 *         - apellidos
 *         - correo_institucional
 *         - numero_empleado
 *         - fecha_registro
 *         - rol_admin
 *         - estado
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_admin:
 *           type: string
 *           description: ID único del administrador
 *         nombre:
 *           type: string
 *           description: Nombre del administrador
 *         apellidos:
 *           type: string
 *           description: Apellidos del administrador
 *         correo_institucional:
 *           type: string
 *           description: Correo electrónico institucional
 *         numero_empleado:
 *           type: string
 *           description: Número de empleado
 *         fecha_registro:
 *           type: string
 *           format: date
 *           description: Fecha en que se registró el administrador
 *         rol_admin:
 *           type: string
 *           description: Rol del administrador en el sistema
 *         estado:
 *           type: string
 *           description: Estado del administrador (activo, inactivo)
 *         registro_actividades:
 *           type: array
 *           description: Historial de actividades realizadas por el administrador
 *           items:
 *             type: object
 *             properties:
 *               id_registro:
 *                 type: string
 *                 description: ID único del registro de actividad
 *               tipo_accion:
 *                 type: string
 *                 description: Tipo de acción realizada
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada de la actividad
 *               fecha_hora:
 *                 type: string
 *                 description: Fecha y hora en que se realizó la actividad
 */

module.exports = router;