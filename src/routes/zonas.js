const { Router } = require('express');
const { db } = require('../firebase')

const router = Router();

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
        municipios_incluidos: [],
        codigos_postales_relacionados: []
    };

    try { 
        await db.collection('zonas').add(nuevaZona);
        res.status(201).json({
            mensaje: 'Colaborador creado exitosamente',
            id_colaborador: id_colaborador
        });
    } catch (error) {
        res.status(500).json({
            error:'Error al crear el colaborador',
            detalle:error.message
        });
    }
});

module.exports = router;