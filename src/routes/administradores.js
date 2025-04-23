const { Router } = require('express');
const { db } = require('../firebase');

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
router.get('/administradores', async (req, res) => {
    try {
        const querySnapshot = await db.collection('administradores').get();
        
        const administradores = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.status(200).json(administradores);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los administradores',
            detalle: error.message
        });
    }
});

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
router.get('/administrador/:id_admin', async (req, res) => {
    const { id_admin } = req.params;

    try {
        const adminsRef = db.collection('administradores');
        const snapshot = await adminsRef.where('id_admin', '==', id_admin).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el administrador con el ID especificado'
            });
        }

        const administrador = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))[0]; // Tomamos el primer documento ya que debería ser único

        res.status(200).json(administrador);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el administrador',
            detalle: error.message
        });
    }
});

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
router.post('/nuevo-administrador', async (req, res) => {
    const { nombre, apellidos, correo_institucional, numero_empleado, rol_admin } = req.body;
    
    try {
        // Generar ID aleatorio de 3 dígitos
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_admin = `admin${randomNum}`;

        // Obtener fecha actual en formato AAAA-MM-DD
        const fecha_registro = new Date().toISOString().split('T')[0];

        const nuevoAdministrador = {
            id_admin,
            nombre,
            apellidos,
            correo_institucional,
            numero_empleado,
            fecha_registro,
            rol_admin,
            estado: "activo",
            registro_actividades: []
        };

        await db.collection('administradores').add(nuevoAdministrador);
        
        res.status(201).json({
            mensaje: 'Administrador creado exitosamente',
            id_admin
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el administrador',
            detalle: error.message
        });
    }
});

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
router.put('/actualizar-administrador/:id_admin', async (req, res) => {
    const { id_admin } = req.params;
    const datosActualizar = req.body;
    
    try {
        // Buscar el administrador por ID
        const adminsRef = db.collection('administradores');
        const snapshot = await adminsRef.where('id_admin', '==', id_admin).get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el administrador con el ID especificado'
            });
        }
        
        // Actualizar el administrador
        const docRef = snapshot.docs[0].ref;
        await docRef.update(datosActualizar);
        
        res.status(200).json({
            mensaje: 'Administrador actualizado exitosamente',
            id_admin
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar el administrador',
            detalle: error.message
        });
    }
});

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
router.delete('/eliminar-administrador/:id_admin', async (req, res) => {
    const { id_admin } = req.params;
    
    try {
        // Buscar el administrador por ID
        const adminsRef = db.collection('administradores');
        const snapshot = await adminsRef.where('id_admin', '==', id_admin).get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el administrador con el ID especificado'
            });
        }
        
        // Eliminar el administrador
        await snapshot.docs[0].ref.delete();
        
        res.status(200).json({
            mensaje: 'Administrador eliminado exitosamente',
            id_admin
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar el administrador',
            detalle: error.message
        });
    }
});

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