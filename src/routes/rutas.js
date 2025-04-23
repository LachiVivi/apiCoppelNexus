const { Router } = require('express');
const { db } = require('../firebase');

const router = Router();

/**
 * @swagger
 * /rutas:
 *   get:
 *     summary: Obtiene la lista de todas las rutas
 *     description: Retorna un array con todas las rutas registradas en la base de datos
 *     tags: [Rutas]
 *     responses:
 *       200:
 *         description: Lista de rutas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ruta'
 *       500:
 *         description: Error del servidor
 */
router.get('/rutas', async (req, res) => {
    try {
        const querySnapshot = await db.collection('rutas').get();
        
        const rutas = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las rutas',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /ruta/{id_ruta}:
 *   get:
 *     summary: Obtiene una ruta por su ID
 *     description: Retorna los datos de una ruta específica según su ID
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id_ruta
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ruta
 *     responses:
 *       200:
 *         description: Datos de la ruta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ruta'
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/ruta/:id_ruta', async (req, res) => {
    const { id_ruta } = req.params;

    try {
        const rutasRef = db.collection('rutas');
        const snapshot = await rutasRef.where('id_ruta', '==', id_ruta).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la ruta con el ID especificado'
            });
        }

        const ruta = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))[0]; // Tomamos el primer documento ya que debería ser único

        res.status(200).json(ruta);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener la ruta',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /nueva-ruta:
 *   post:
 *     summary: Crea una nueva ruta
 *     description: Crea un nuevo registro de ruta en la base de datos
 *     tags: [Rutas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_ruta
 *               - id_zona_asociada
 *               - ubicaciones
 *             properties:
 *               nombre_ruta:
 *                 type: string
 *                 description: Nombre de la ruta
 *               id_zona_asociada:
 *                 type: string
 *                 description: ID de la zona asociada a la ruta
 *               ubicaciones:
 *                 type: array
 *                 description: Lista de ubicaciones que componen la ruta
 *                 items:
 *                   type: object
 *                   properties:
 *                     descripcion_punto:
 *                       type: string
 *                     coordenadas:
 *                       type: object
 *                       properties:
 *                         latitud:
 *                           type: number
 *                         longitud:
 *                           type: number
 *     responses:
 *       201:
 *         description: Ruta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Ruta creada exitosamente
 *                 id_ruta:
 *                   type: string
 *                   example: rut123
 *       500:
 *         description: Error al crear la ruta
 */
router.post('/nueva-ruta', async (req, res) => {
    const { nombre_ruta, id_zona_asociada, ubicaciones } = req.body;
    
    try {
        // Generar ID aleatorio de 3 dígitos
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_ruta = `rut${randomNum}`;

        // Obtener fecha actual en formato AAAA-MM-DD
        const fecha_creacion = new Date().toISOString().split('T')[0];

        const nuevaRuta = {
            id_ruta,
            nombre_ruta,
            id_zona_asociada,
            ubicaciones,
            fecha_creacion
        };

        await db.collection('rutas').add(nuevaRuta);
        
        res.status(201).json({
            mensaje: 'Ruta creada exitosamente',
            id_ruta
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear la ruta',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /actualizar-ruta/{id_ruta}:
 *   put:
 *     summary: Actualiza una ruta
 *     description: Actualiza los datos de una ruta existente
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id_ruta
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ruta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_ruta:
 *                 type: string
 *                 description: Nombre de la ruta
 *               id_zona_asociada:
 *                 type: string
 *                 description: ID de la zona asociada a la ruta
 *               ubicaciones:
 *                 type: array
 *                 description: Lista de ubicaciones que componen la ruta
 *                 items:
 *                   type: object
 *                   properties:
 *                     descripcion_punto:
 *                       type: string
 *                     coordenadas:
 *                       type: object
 *                       properties:
 *                         latitud:
 *                           type: number
 *                         longitud:
 *                           type: number
 *     responses:
 *       200:
 *         description: Ruta actualizada exitosamente
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error al actualizar la ruta
 */
router.put('/actualizar-ruta/:id_ruta', async (req, res) => {
    const { id_ruta } = req.params;
    const datosActualizar = req.body;
    
    try {
        // Buscar la ruta por ID
        const rutasRef = db.collection('rutas');
        const snapshot = await rutasRef.where('id_ruta', '==', id_ruta).get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la ruta con el ID especificado'
            });
        }
        
        // Actualizar la ruta
        const docRef = snapshot.docs[0].ref;
        await docRef.update({
            ...datosActualizar,
            fecha_actualizacion: new Date().toISOString().split('T')[0]
        });
        
        res.status(200).json({
            mensaje: 'Ruta actualizada exitosamente',
            id_ruta
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la ruta',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /eliminar-ruta/{id_ruta}:
 *   delete:
 *     summary: Elimina una ruta
 *     description: Elimina una ruta de la base de datos según su ID
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id_ruta
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ruta a eliminar
 *     responses:
 *       200:
 *         description: Ruta eliminada exitosamente
 *       404:
 *         description: Ruta no encontrada
 *       500:
 *         description: Error al eliminar la ruta
 */
router.delete('/eliminar-ruta/:id_ruta', async (req, res) => {
    const { id_ruta } = req.params;
    
    try {
        // Buscar la ruta por ID
        const rutasRef = db.collection('rutas');
        const snapshot = await rutasRef.where('id_ruta', '==', id_ruta).get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la ruta con el ID especificado'
            });
        }
        
        // Eliminar la ruta
        await snapshot.docs[0].ref.delete();
        
        res.status(200).json({
            mensaje: 'Ruta eliminada exitosamente',
            id_ruta
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar la ruta',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /rutas-por-zona/{id_zona}:
 *   get:
 *     summary: Obtiene las rutas asociadas a una zona
 *     description: Retorna todas las rutas que pertenecen a una zona específica
 *     tags: [Rutas]
 *     parameters:
 *       - in: path
 *         name: id_zona
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la zona
 *     responses:
 *       200:
 *         description: Lista de rutas de la zona
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ruta'
 *       500:
 *         description: Error del servidor
 */
router.get('/rutas-por-zona/:id_zona', async (req, res) => {
    const { id_zona } = req.params;

    try {
        const rutasRef = db.collection('rutas');
        const snapshot = await rutasRef.where('id_zona_asociada', '==', id_zona).get();

        const rutas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las rutas por zona',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Ruta:
 *       type: object
 *       required:
 *         - id_ruta
 *         - nombre_ruta
 *         - id_zona_asociada
 *         - ubicaciones
 *         - fecha_creacion
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_ruta:
 *           type: string
 *           description: ID único de la ruta
 *         nombre_ruta:
 *           type: string
 *           description: Nombre descriptivo de la ruta
 *         id_zona_asociada:
 *           type: string
 *           description: ID de la zona asociada a esta ruta
 *         ubicaciones:
 *           type: array
 *           description: Lista de ubicaciones que componen la ruta
 *           items:
 *             type: object
 *             properties:
 *               descripcion_punto:
 *                 type: string
 *                 description: Descripción del punto (nombre del lugar)
 *               coordenadas:
 *                 type: object
 *                 properties:
 *                   latitud:
 *                     type: number
 *                     description: Coordenada de latitud
 *                   longitud:
 *                     type: number
 *                     description: Coordenada de longitud
 *         fecha_creacion:
 *           type: string
 *           format: date
 *           description: Fecha en que se creó la ruta
 *         fecha_actualizacion:
 *           type: string
 *           format: date
 *           description: Fecha de la última actualización de la ruta
 */

module.exports = router;