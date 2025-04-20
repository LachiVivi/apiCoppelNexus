const {Router} =  require('express');
const{db} = require('../firebase')

const router = Router();

//Crear microempresario
//http://localhost:3000/nuevo-microempresario
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

//Listar microempresarios
//http://localhost:3000/microempresarios
router.get('/microempresarios', async (req, res) => {
    const snapshot = await db.collection('microempresarios').get();
    const microempresarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.status(200).json(microempresarios);
});

//Obtener microempresario por id_microempresario
//http://localhost:3000/microempresario/:id_microempresario
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

//Actualizar microempresario
//http://localhost:3000/actualizar-microempresario/:id_microempresario
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

//Eliminar microempresario
//http://localhost:3000/eliminar-microempresario/:id_microempresario
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

module.exports = router;