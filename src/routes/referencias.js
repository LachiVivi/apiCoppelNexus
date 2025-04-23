const { Router } = require('express');
const { db } = require('../firebase');

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
router.get('/referencias', async (req, res) => {
    try {
        const querySnapshot = await db.collection('referencias').get();
        
        const referencias = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json(referencias);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las referencias',
            detalle: error.message
        });
    }
});

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
router.get('/referencia/:id_referencia', async (req, res) => {
    const { id_referencia } = req.params;

    try {
        const referenciasRef = db.collection('referencias');
        const snapshot = await referenciasRef.where('id_referencia', '==', id_referencia).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la referencia con el ID especificado'
            });
        }

        const referencia = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))[0]; // Tomamos el primer documento ya que debería ser único

        res.status(200).json(referencia);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener la referencia',
            detalle: error.message
        });
    }
});

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
router.post('/nueva-referencia', async (req, res) => {
    const { id_colaborador, id_microempresario } = req.body;
    
    try {
        // Generar ID aleatorio de 3 dígitos
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_referencia = `ref${randomNum}`;

        // Obtener fecha actual en formato AAAA-MM-DD
        const fecha_actual = new Date().toISOString().split('T')[0];

        const nuevaReferencia = {
            id_referencia,
            id_colaborador,
            id_microempresario,
            estado_referencia: "pendiente",
            fecha_referencia: fecha_actual,
            historial_estados: [
                {
                    estado: "pendiente",
                    fecha: fecha_actual
                }
            ]
        };

        await db.collection('referencias').add(nuevaReferencia);
        
        res.status(201).json({
            mensaje: 'Referencia creada exitosamente',
            id_referencia
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear la referencia',
            detalle: error.message
        });
    }
});

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
router.put('/actualizar-referencia/:id_referencia', async (req, res) => {
    const { id_referencia } = req.params;
    const { estado_referencia } = req.body;
    
    try {
        // Buscar la referencia por ID
        const referenciasRef = db.collection('referencias');
        const snapshot = await referenciasRef.where('id_referencia', '==', id_referencia).get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la referencia con el ID especificado'
            });
        }
        
        // Obtener fecha actual en formato AAAA-MM-DD
        const fecha_actual = new Date().toISOString().split('T')[0];
        
        // Obtener la referencia actual
        const docRef = snapshot.docs[0].ref;
        const referenciaActual = snapshot.docs[0].data();
        
        // Crear el nuevo estado para el historial
        const nuevoEstado = {
            estado: estado_referencia,
            fecha: fecha_actual
        };
        
        // Actualizar la referencia con el nuevo estado y añadirlo al historial
        await docRef.update({
            estado_referencia,
            historial_estados: [...referenciaActual.historial_estados, nuevoEstado]
        });
        
        res.status(200).json({
            mensaje: 'Referencia actualizada exitosamente',
            id_referencia
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la referencia',
            detalle: error.message
        });
    }
});

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
router.delete('/eliminar-referencia/:id_referencia', async (req, res) => {
    const { id_referencia } = req.params;
    
    try {
        // Buscar la referencia por ID
        const referenciasRef = db.collection('referencias');
        const snapshot = await referenciasRef.where('id_referencia', '==', id_referencia).get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la referencia con el ID especificado'
            });
        }
        
        // Eliminar la referencia
        await snapshot.docs[0].ref.delete();
        
        res.status(200).json({
            mensaje: 'Referencia eliminada exitosamente',
            id_referencia
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar la referencia',
            detalle: error.message
        });
    }
});

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