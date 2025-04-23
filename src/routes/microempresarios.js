const { Router } = require('express');
const MicroempresarioController = require('../controllers/MicroempresarioController');

const router = Router();

/**
 * @swagger
 * /nuevo-microempresario:
 *   post:
 *     summary: Crea un nuevo microempresario
 *     description: Crea un nuevo registro de microempresario en la base de datos
 *     tags: [Microempresarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellidos
 *               - telefono
 *               - correo_electronico
 *               - nombre_negocio
 *               - tipo_negocio
 *               - ubicacion
 *               - coordenadas_geograficas
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del microempresario
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del microempresario
 *               telefono:
 *                 type: string
 *                 description: Número de teléfono de contacto
 *               correo_electronico:
 *                 type: string
 *                 description: Correo electrónico del microempresario
 *               nombre_negocio:
 *                 type: string
 *                 description: Nombre del negocio
 *               tipo_negocio:
 *                 type: string
 *                 description: Tipo o categoría del negocio
 *               foto_negocio_url:
 *                 type: string
 *                 description: URL de la foto del negocio
 *               ubicacion:
 *                 type: object
 *                 properties:
 *                   estado:
 *                     type: string
 *                     description: Estado donde se ubica el negocio
 *                   municipio:
 *                     type: string
 *                     description: Municipio donde se ubica el negocio
 *                   colonia:
 *                     type: string
 *                     description: Colonia donde se ubica el negocio
 *                   codigo_postal:
 *                     type: string
 *                     description: Código postal de la ubicación
 *                   calle:
 *                     type: string
 *                     description: Calle donde se ubica el negocio
 *                   numero_edificio:
 *                     type: string
 *                     description: Número del edificio
 *               coordenadas_geograficas:
 *                 type: object
 *                 properties:
 *                   latitud:
 *                     type: number
 *                     format: float
 *                     description: Latitud de la ubicación geográfica
 *                   longitud:
 *                     type: number
 *                     format: float
 *                     description: Longitud de la ubicación geográfica
 *     responses:
 *       201:
 *         description: Microempresario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Microempresario creado exitosamente
 *                 id_microempresario:
 *                   type: string
 *                   example: me123
 *       500:
 *         description: Error al crear el microempresario
 */
router.post('/nuevo-microempresario', MicroempresarioController.crearMicroempresario);

/**
 * @swagger
 * /microempresarios:
 *   get:
 *     summary: Obtiene la lista de todos los microempresarios
 *     description: Retorna un array con todos los microempresarios registrados en la base de datos
 *     tags: [Microempresarios]
 *     responses:
 *       200:
 *         description: Lista de microempresarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Microempresario'
 *       500:
 *         description: Error del servidor
 */
router.get('/microempresarios', MicroempresarioController.obtenerTodosMicroempresarios);

/**
 * @swagger
 * /microempresario/{id_microempresario}:
 *   get:
 *     summary: Obtiene un microempresario por su ID
 *     description: Retorna los datos de un microempresario específico según su ID
 *     tags: [Microempresarios]
 *     parameters:
 *       - in: path
 *         name: id_microempresario
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del microempresario
 *     responses:
 *       200:
 *         description: Datos del microempresario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Microempresario'
 *       404:
 *         description: Microempresario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/microempresario/:id_microempresario', MicroempresarioController.obtenerMicroempresarioPorId);

/**
 * @swagger
 * /actualizar-microempresario/{id_microempresario}:
 *   put:
 *     summary: Actualiza los datos de un microempresario
 *     description: Actualiza la información de un microempresario existente identificado por su ID
 *     tags: [Microempresarios]
 *     parameters:
 *       - in: path
 *         name: id_microempresario
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del microempresario a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del microempresario
 *               apellidos:
 *                 type: string
 *                 description: Apellidos del microempresario
 *               telefono:
 *                 type: string
 *                 description: Número de teléfono de contacto
 *               correo_electronico:
 *                 type: string
 *                 description: Correo electrónico del microempresario
 *               nombre_negocio:
 *                 type: string
 *                 description: Nombre del negocio
 *               tipo_negocio:
 *                 type: string
 *                 description: Tipo o categoría del negocio
 *               foto_negocio_url:
 *                 type: string
 *                 description: URL de la foto del negocio
 *               ubicacion:
 *                 type: object
 *                 properties:
 *                   estado:
 *                     type: string
 *                   municipio:
 *                     type: string
 *                   colonia:
 *                     type: string
 *                   codigo_postal:
 *                     type: string
 *                   calle:
 *                     type: string
 *                   numero_edificio:
 *                     type: string
 *               coordenadas_geograficas:
 *                 type: object
 *                 properties:
 *                   latitud:
 *                     type: number
 *                     format: float
 *                   longitud:
 *                     type: number
 *                     format: float
 *     responses:
 *       200:
 *         description: Microempresario actualizado exitosamente
 *       404:
 *         description: Microempresario no encontrado
 *       500:
 *         description: Error al actualizar el microempresario
 */
router.put('/actualizar-microempresario/:id_microempresario', MicroempresarioController.actualizarMicroempresario);

/**
 * @swagger
 * /eliminar-microempresario/{id_microempresario}:
 *   delete:
 *     summary: Elimina un microempresario
 *     description: Elimina un microempresario de la base de datos según su ID
 *     tags: [Microempresarios]
 *     parameters:
 *       - in: path
 *         name: id_microempresario
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del microempresario a eliminar
 *     responses:
 *       200:
 *         description: Microempresario eliminado exitosamente
 *       404:
 *         description: Microempresario no encontrado
 *       500:
 *         description: Error al eliminar el microempresario
 */
router.delete('/eliminar-microempresario/:id_microempresario', MicroempresarioController.eliminarMicroempresario);

/**
 * @swagger
 * components:
 *   schemas:
 *     Microempresario:
 *       type: object
 *       required:
 *         - id_microempresario
 *         - nombre
 *         - apellidos
 *         - telefono
 *         - correo_electronico
 *         - nombre_negocio
 *         - tipo_negocio
 *         - ubicacion
 *         - coordenadas_geograficas
 *         - fecha_registro
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_microempresario:
 *           type: string
 *           description: ID único del microempresario
 *         nombre:
 *           type: string
 *           description: Nombre del microempresario
 *         apellidos:
 *           type: string
 *           description: Apellidos del microempresario
 *         telefono:
 *           type: string
 *           description: Número de teléfono de contacto
 *         correo_electronico:
 *           type: string
 *           description: Correo electrónico del microempresario
 *         nombre_negocio:
 *           type: string
 *           description: Nombre del negocio
 *         tipo_negocio:
 *           type: string
 *           description: Tipo o categoría del negocio
 *         foto_negocio_url:
 *           type: string
 *           description: URL de la foto del negocio
 *         ubicacion:
 *           type: object
 *           properties:
 *             estado:
 *               type: string
 *               description: Estado donde se ubica el negocio
 *             municipio:
 *               type: string
 *               description: Municipio donde se ubica el negocio
 *             colonia:
 *               type: string
 *               description: Colonia donde se ubica el negocio
 *             codigo_postal:
 *               type: string
 *               description: Código postal de la ubicación
 *             calle:
 *               type: string
 *               description: Calle donde se ubica el negocio
 *             numero_edificio:
 *               type: string
 *               description: Número del edificio
 *         coordenadas_geograficas:
 *           type: object
 *           properties:
 *             latitud:
 *               type: number
 *               format: float
 *               description: Latitud de la ubicación geográfica
 *             longitud:
 *               type: number
 *               format: float
 *               description: Longitud de la ubicación geográfica
 *         fecha_registro:
 *           type: string
 *           format: date
 *           description: Fecha de registro del microempresario en formato AAAA-MM-DD
 */

module.exports = router;