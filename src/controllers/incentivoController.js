const incentivoModel = require('../models/incentivoModel');

class IncentivoController {
    // Obtener todos los incentivos
    async obtenerTodos(req, res) {
        try {
            const incentivos = await incentivoModel.obtenerTodos();
            res.status(200).json(incentivos);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener los incentivos',
                detalle: error.message
            });
        }
    }

    // Crear nuevo incentivo
    async crear(req, res) {
        try {
            const { titulo, descripcion } = req.body;
            
            const id_incentivo = await incentivoModel.crear({
                titulo,
                descripcion
            });
            
            res.status(201).json({
                mensaje: 'Incentivo creado exitosamente',
                id_incentivo
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al crear el incentivo',
                detalle: error.message
            });
        }
    }
}

module.exports = new IncentivoController();