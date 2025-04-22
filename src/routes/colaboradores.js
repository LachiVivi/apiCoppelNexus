const {Router} =  require('express');
const{db} = require('../firebase');

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
router.get('/colaboradores', async (req , res) =>{
    const querySnapshot =  await db.collection('colaboradores').get()

    const colaboradores = querySnapshot.docs.map(doc =>({
        id:doc.id,
        ...doc.data()
    }))
    res.status(200).json(colaboradores);
});

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
router.post('/nuevo-colaborador', async (req, res) => {
    const { nombre, apellidos, numero_empleado, zona_actual, contrasenia, foto_perfil_url } = req.body;
    
    //Id de colaborador aleatorio
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const id_colaborador = `col${randomNum}`;
    
    //Fecha actual
    const fecha_registro = new Date().toISOString().split('T')[0];
    
    const nuevoColaborador = {
        id_colaborador,
        nombre,
        apellidos,
        numero_empleado,
        zona_actual,
        contrasenia,
        fecha_registro,
        foto_perfil_url,
        incentivos_canjeados: [],
        registro_actividades: [],
        notificaciones: [],
        rutas:[]
    };

    try {
        await db.collection('colaboradores').add(nuevoColaborador);
        res.status(201).json({
            mensaje: 'Colaborador creado exitosamente',
            id_colaborador: id_colaborador
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el colaborador',
            detalle: error.message
        });
    }
});

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
router.get('/colaborador/:numero_empleado', async (req, res) => {
    const { numero_empleado } = req.params;

    try {
        const colaboradoresRef = db.collection('colaboradores');
        const snapshot = await colaboradoresRef.where('numero_empleado', '==', numero_empleado).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el colaborador con el número de empleado especificado'
            });
        }

        const colaborador = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))[0]; // Tomamos el primer documento ya que debería ser único

        res.status(200).json(colaborador);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el colaborador',
            detalle: error.message
        });
    }
});

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
router.put('/actualizar-colaborador/:numero_empleado', async (req, res) => {
    const { numero_empleado } = req.params;
    const { nombre, apellidos, nuevo_numero_empleado, zona_actual, contrasenia, foto_perfil_url } = req.body;

    try {
        // Busca por número de empleado
        const colaboradoresRef = db.collection('colaboradores');
        const snapshot = await colaboradoresRef.where('numero_empleado', '==', numero_empleado).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el colaborador con el número de empleado especificado'
            });
        }

        const updates = [];
        snapshot.forEach(doc => {
            const updateData = {};
            
            if (nombre) updateData.nombre = nombre;
            if (apellidos) updateData.apellidos = apellidos;
            if (nuevo_numero_empleado) updateData.numero_empleado = nuevo_numero_empleado;
            if (zona_actual) updateData.zona_actual = zona_actual;
            if (contrasenia) updateData.contrasenia = contrasenia;
            if (foto_perfil_url) updateData.foto_perfil_url = foto_perfil_url;

            updates.push(doc.ref.update(updateData));
        });

        await Promise.all(updates);
        
        res.status(200).json({
            mensaje: 'Colaborador actualizado exitosamente',
            numero_empleado: nuevo_numero_empleado || numero_empleado
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar el colaborador',
            detalle: error.message
        });
    }
});

/**
 * @swagger
 * /eliminar-colaborador/{numero_empleado}:
 *   get:
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
router.get('/eliminar-colaborador/:numero_empleado', async (req, res) => {
    const { numero_empleado } = req.params;

    try {
        // Buscar el documento por número de empleado
        const colaboradoresRef = db.collection('colaboradores');
        const snapshot = await colaboradoresRef.where('numero_empleado', '==', numero_empleado).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el colaborador con el número de empleado especificado'
            });
        }

        // Eliminar cada documento encontrado (debería ser solo uno)
        const deletes = [];
        snapshot.forEach(doc => {
            deletes.push(doc.ref.delete());
        });

        await Promise.all(deletes);
        
        res.status(200).json({
            mensaje: 'Colaborador eliminado exitosamente',
            numero_empleado: numero_empleado
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar el colaborador',
            detalle: error.message
        });
    }
});

module.exports = router;