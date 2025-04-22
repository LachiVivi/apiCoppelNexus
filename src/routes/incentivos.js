const {Router} =  require('express');
const{db} = require('../firebase')

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
router.post('/nuevo-incentivo', async (req, res) => {
    const{
        titulo,
        descripcion
    } = req.body;

    try {
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_incentivo = `me${randomNum}`;

        const nuevoIncentivo = {
            id_incentivo,
            titulo,
            descripcion
        };

        await db.collection('incentivos').add(nuevoIncentivo);

        res.status(201).json({
            mensaje: 'Incentivo creado exitosamente',
            id_incentivo: id_incentivo
        });
    } catch(error){
        res.status(500).json({
            error: 'Error al crear el incentivo',
            detalle: error.message
        });
    }
});

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
router.get('/incentivos', async (req, res) => {
    const snapshot = await db.collection('incentivos').get();
    const incentivos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.status(200).json(incentivos);
});

module.exports = router;