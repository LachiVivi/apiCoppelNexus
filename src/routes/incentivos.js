const {Router} =  require('express');
const{db} = require('../firebase')

const router = Router();

//Crear nuevo incentivo
//http://localhost:3000/nuevo-incentivo
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

//Obtener lista de incentivos
//http://localhost:3000/incentivos
router.get('/incentivos', async (req, res) => {
    const snapshot = await db.collection('incentivos').get();
    const incentivos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.status(200).json(incentivos);
});

module.exports = router;