const {Router} =  require('express');
const{db} = require('../firebase')

const router = Router();

//Lista de colaboradores
//http://localhost:3000/colaboradores
router.get('/colaboradores', async (req , res) =>{

    const querySnapshot =  await db.collection('colaboradores').get()

    const colaboradores = querySnapshot.docs.map(doc =>({
        id:doc.id,
        ...doc.data()
    }))
    res.status(200).json(colaboradores);
});

//Crear colaborador
//http://localhost:3000/nuevo-colaborador
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

//Obtener colaborador por número de empleado
//http://localhost:3000/colaborador/:numero_empleado
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

//Actualizar colaborador
//http://localhost:3000/actualizar-colaborador/:numero_empleado
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

//Eliminar colaborador
//http://localhost:3000/eliminar-colaborador/:numero_empleado
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