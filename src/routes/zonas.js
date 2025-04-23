const { Router } = require('express');
const { db } = require('../firebase')

const router = Router();

/**
 * @swagger
 * /nueva-zona:
 *   post:
 *     summary: Crea una nueva zona
 *     description: Crea un nuevo registro de zona en la base de datos
 *     tags: [Zonas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_zona
 *               - estado
 *             properties:
 *               nombre_zona:
 *                 type: string
 *                 description: Nombre de la zona
 *               estado:
 *                 type: string
 *                 description: Estado al que pertenece la zona
 *               municipios_incluidos:
 *                 type: array
 *                 description: Lista de municipios que incluye la zona
 *                 items:
 *                   type: string
 *               codigos_postales_relacionados:
 *                 type: array
 *                 description: Lista de códigos postales que pertenecen a la zona
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Zona creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Zona creada exitosamente
 *                 id_zona:
 *                   type: string
 *                   example: me123
 *       500:
 *         description: Error al crear la zona
 */
router.post('/nueva-zona', async (req, res) => {
    const {
        nombre_zona,
        estado,
        municipios_incluidos,
        codigos_postales_relacionados
    } = req.body;

    const randomNum = Math.floor(Math.random() * 900) + 100;
    const id_zona = `me${randomNum}`;

    const nuevaZona = {
        id_zona,
        nombre_zona,
        estado,
        municipios_incluidos: municipios_incluidos || [],
        codigos_postales_relacionados: codigos_postales_relacionados || []
    };

    try { 
        await db.collection('zonas').add(nuevaZona);
        res.status(201).json({
            mensaje: 'Zona creada exitosamente',
            id_zona: id_zona
        });
    } catch (error) {
        res.status(500).json({
            error:'Error al crear la zona',
            detalle:error.message
        });
    }
});

/**
 * @swagger
 * /zonas:
 *   get:
 *     summary: Obtiene la lista de todas las zonas
 *     description: Retorna un array con todas las zonas registradas en la base de datos
 *     tags: [Zonas]
 *     responses:
 *       200:
 *         description: Lista de zonas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zona'
 *       500:
 *         description: Error del servidor
 */
router.get('/zonas', async (req, res) => {
    try {
        const snapshot = await db.collection('zonas').get();
        const zonas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(zonas);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener las zonas',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /zona/{id_zona}:
 *   get:
 *     summary: Obtiene una zona por su ID
 *     description: Retorna los datos de una zona específica según su ID
 *     tags: [Zonas]
 *     parameters:
 *       - in: path
 *         name: id_zona
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la zona
 *     responses:
 *       200:
 *         description: Datos de la zona
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zona'
 *       404:
 *         description: Zona no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/zona/:id_zona', async (req, res) => {
    const { id_zona } = req.params;

    try {
        const zonasRef = db.collection('zonas');
        const snapshot = await zonasRef.where('id_zona', '==', id_zona).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la zona con el ID especificado'
            });
        }

        const zona = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))[0]; // Tomamos el primer documento ya que debería ser único

        res.status(200).json(zona);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener la zona',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /actualizar-zona/{id_zona}:
 *   put:
 *     summary: Actualiza los datos de una zona
 *     description: Actualiza la información de una zona existente identificada por su ID
 *     tags: [Zonas]
 *     parameters:
 *       - in: path
 *         name: id_zona
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la zona a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_zona:
 *                 type: string
 *                 description: Nombre de la zona
 *               estado:
 *                 type: string
 *                 description: Estado al que pertenece la zona
 *               municipios_incluidos:
 *                 type: array
 *                 description: Lista de municipios que incluye la zona
 *                 items:
 *                   type: string
 *               codigos_postales_relacionados:
 *                 type: array
 *                 description: Lista de códigos postales que pertenecen a la zona
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Zona actualizada exitosamente
 *       404:
 *         description: Zona no encontrada
 *       500:
 *         description: Error al actualizar la zona
 */
router.put('/actualizar-zona/:id_zona', async (req, res) => {
    const { id_zona } = req.params;
    const { nombre_zona, estado, municipios_incluidos, codigos_postales_relacionados } = req.body;   

    try {
        const zonasRef = db.collection('zonas');
        const snapshot = await zonasRef.where('id_zona', '==', id_zona).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la zona con el ID especificado'
            });
        }

        const updateData = {};
        
        // Solo actualizar los campos que se proporcionan
        if (nombre_zona) updateData.nombre_zona = nombre_zona;
        if (estado) updateData.estado = estado;
        if (municipios_incluidos) updateData.municipios_incluidos = municipios_incluidos;
        if (codigos_postales_relacionados) updateData.codigos_postales_relacionados = codigos_postales_relacionados;

        // Actualizar el documento
        await snapshot.docs[0].ref.update(updateData);
        
        res.status(200).json({
            mensaje: 'Zona actualizada exitosamente',
            id_zona: id_zona
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar la zona',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /eliminar-zona/{id_zona}:
 *   delete:
 *     summary: Elimina una zona
 *     description: Elimina una zona de la base de datos según su ID
 *     tags: [Zonas]
 *     parameters:
 *       - in: path
 *         name: id_zona
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la zona a eliminar
 *     responses:
 *       200:
 *         description: Zona eliminada exitosamente
 *       404:
 *         description: Zona no encontrada
 *       500:
 *         description: Error al eliminar la zona
 */
router.get('/eliminar-zona/:id_zona', async (req, res) => {
    const { id_zona } = req.params;

    try {
        // Buscar el documento por ID de zona
        const zonasRef = db.collection('zonas');
        const snapshot = await zonasRef.where('id_zona', '==', id_zona).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró la zona con el ID especificado'
            });
        }

        // Eliminar cada documento encontrado (debería ser solo uno)
        const deletes = [];
        snapshot.forEach(doc => {
            deletes.push(doc.ref.delete());
        });

        await Promise.all(deletes);
        
        res.status(200).json({
            mensaje: 'Zona eliminada exitosamente',
            id_zona: id_zona
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar la zona',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Zona:
 *       type: object
 *       required:
 *         - id_zona
 *         - nombre_zona
 *         - estado
 *       properties:
 *         id:
 *           type: string
 *           description: ID del documento en Firebase
 *         id_zona:
 *           type: string
 *           description: ID único de la zona
 *         nombre_zona:
 *           type: string
 *           description: Nombre de la zona
 *         estado:
 *           type: string
 *           description: Estado al que pertenece la zona
 *         municipios_incluidos:
 *           type: array
 *           description: Lista de municipios que incluye la zona
 *           items:
 *             type: string
 *         codigos_postales_relacionados:
 *           type: array
 *           description: Lista de códigos postales que pertenecen a la zona
 *           items:
 *             type: string
 */

module.exports = router;