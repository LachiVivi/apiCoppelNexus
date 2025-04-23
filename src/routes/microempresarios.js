const {Router} =  require('express');
const{db} = require('../firebase')

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
router.post('/nuevo-microempresario', async (req, res) => {
    const {
        nombre,
        apellidos,
        telefono,
        correo_electronico,
        nombre_negocio,
        tipo_negocio,
        foto_negocio_url,
        ubicacion,
        coordenadas_geograficas
    } = req.body;

    try {
        // Generar ID aleatorio de 3 dígitos
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_microempresario = `me${randomNum}`;
        
        // Obtener fecha actual en formato AAAA-MM-DD
        const fecha_registro = new Date().toISOString().split('T')[0];

        const nuevoMicroempresario = {
            id_microempresario,
            nombre,
            apellidos,
            telefono,
            correo_electronico,
            nombre_negocio,
            tipo_negocio,
            foto_negocio_url,
            ubicacion: {
                estado: ubicacion.estado,
                municipio: ubicacion.municipio,
                colonia: ubicacion.colonia,
                codigo_postal: ubicacion.codigo_postal,
                calle: ubicacion.calle,
                numero_edificio: ubicacion.numero_edificio
            },
            coordenadas_geograficas: {
                latitud: coordenadas_geograficas.latitud,
                longitud: coordenadas_geograficas.longitud
            },
            fecha_registro
        };

        await db.collection('microempresarios').add(nuevoMicroempresario);
        
        res.status(201).json({
            mensaje: 'Microempresario creado exitosamente',
            id_microempresario: id_microempresario
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el microempresario',
            detalle: error.message
        });
    }
});

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
router.get('/microempresarios', async (req, res) => {
    const snapshot = await db.collection('microempresarios').get();
    const microempresarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.status(200).json(microempresarios);
});

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
router.get('/microempresario/:id_microempresario', async (req, res) => {
    const { id_microempresario } = req.params;

    try {
        const colaboradoresRef = db.collection('microempresarios');
        const snapshot = await colaboradoresRef.where('id_microempresario', '==', id_microempresario).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el microempresario con el ID especificado'
            });
        }

        const microempresario = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))[0]; // Tomamos el primer documento ya que debería ser único

        res.status(200).json(microempresario);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el microempresario',
            detalle: error.message
        });
    }
}); 

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
router.put('/actualizar-microempresario/:id_microempresario', async (req, res) => {
    const { id_microempresario } = req.params;
    const { nombre, apellidos, telefono, correo_electronico, nombre_negocio, tipo_negocio, foto_negocio_url, ubicacion, coordenadas_geograficas } = req.body;   

    try {
        const microempresariosRef = db.collection('microempresarios');
        const snapshot = await microempresariosRef.where('id_microempresario', '==', id_microempresario).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el microempresario con el ID especificado'
            });
        }

        const updateData = {};
        
        // Solo actualizar los campos que se proporcionan
        if (nombre) updateData.nombre = nombre;
        if (apellidos) updateData.apellidos = apellidos;
        if (telefono) updateData.telefono = telefono;
        if (correo_electronico) updateData.correo_electronico = correo_electronico;
        if (nombre_negocio) updateData.nombre_negocio = nombre_negocio;
        if (tipo_negocio) updateData.tipo_negocio = tipo_negocio;
        if (foto_negocio_url) updateData.foto_negocio_url = foto_negocio_url;
        
        if (ubicacion) {
            updateData.ubicacion = {
                estado: ubicacion.estado || snapshot.docs[0].data().ubicacion.estado,
                municipio: ubicacion.municipio || snapshot.docs[0].data().ubicacion.municipio,
                colonia: ubicacion.colonia || snapshot.docs[0].data().ubicacion.colonia,
                codigo_postal: ubicacion.codigo_postal || snapshot.docs[0].data().ubicacion.codigo_postal,
                calle: ubicacion.calle || snapshot.docs[0].data().ubicacion.calle,
                numero_edificio: ubicacion.numero_edificio || snapshot.docs[0].data().ubicacion.numero_edificio
            };
        }
        
        if (coordenadas_geograficas) {
            updateData.coordenadas_geograficas = {
                latitud: coordenadas_geograficas.latitud || snapshot.docs[0].data().coordenadas_geograficas.latitud,
                longitud: coordenadas_geograficas.longitud || snapshot.docs[0].data().coordenadas_geograficas.longitud
            };
        }

        // Actualizar el documento
        await snapshot.docs[0].ref.update(updateData);
        
        res.status(200).json({
            mensaje: 'Microempresario actualizado exitosamente',
            id_microempresario: id_microempresario
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al actualizar el microempresario',
            detalle: error.message
        });
    }
});

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
router.get('/eliminar-microempresario/:id_microempresario', async (req, res) => {
    const { id_microempresario } = req.params;

    try {
        // Buscar el documento por número de empleado
        const microempresariosRef = db.collection('microempresarios');
        const snapshot = await microempresariosRef.where('id_microempresario', '==', id_microempresario).get();

        if (snapshot.empty) {
            return res.status(404).json({
                error: 'No se encontró el micrompresario con el id especificado'
            });
        }

        // Eliminar cada documento encontrado (debería ser solo uno)
        const deletes = [];
        snapshot.forEach(doc => {
            deletes.push(doc.ref.delete());
        });

        await Promise.all(deletes);
        
        res.status(200).json({
            mensaje: 'Microempresario eliminado exitosamente',
            id_microempresario: id_microempresario
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar el micromepresario',
            detalle: error.message
        });
    }
});

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