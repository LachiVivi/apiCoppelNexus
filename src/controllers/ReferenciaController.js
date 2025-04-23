// controllers/ReferenciaController.js
const ReferenciaModel = require('../models/ReferenciaModel');

class ReferenciaController {
    // Obtener todas las referencias
    async obtenerTodasReferencias(req, res) {
        const resultado = await ReferenciaModel.obtenerTodas();
        
        if (resultado.exito) {
            res.status(200).json(resultado.datos);
        } else {
            res.status(500).json({
                error: 'Error al obtener las referencias',
                detalle: resultado.error
            });
        }
    }

    // Obtener una referencia por ID
    async obtenerReferenciaPorId(req, res) {
        const { id_referencia } = req.params;
        const resultado = await ReferenciaModel.obtenerPorId(id_referencia);

        if (resultado.exito) {
            res.status(200).json(resultado.datos);
        } else if (resultado.noEncontrado) {
            res.status(404).json({
                error: 'No se encontró la referencia con el ID especificado'
            });
        } else {
            res.status(500).json({
                error: 'Error al obtener la referencia',
                detalle: resultado.error
            });
        }
    }

    // Crear una nueva referencia
    async crearReferencia(req, res) {
        const { id_colaborador, id_microempresario } = req.body;
        
        const datos = {
            id_colaborador,
            id_microempresario
        };
        
        const resultado = await ReferenciaModel.crear(datos);
        
        if (resultado.exito) {
            res.status(201).json({
                mensaje: 'Referencia creada exitosamente',
                id_referencia: resultado.id_referencia
            });
        } else {
            res.status(500).json({
                error: 'Error al crear la referencia',
                detalle: resultado.error
            });
        }
    }

    // Actualizar el estado de una referencia
    async actualizarReferenciaEstado(req, res) {
        const { id_referencia } = req.params;
        const { estado_referencia } = req.body;
        
        const resultado = await ReferenciaModel.actualizarEstado(id_referencia, estado_referencia);
        
        if (resultado.exito) {
            res.status(200).json({
                mensaje: 'Referencia actualizada exitosamente',
                id_referencia
            });
        } else if (resultado.noEncontrado) {
            res.status(404).json({
                error: 'No se encontró la referencia con el ID especificado'
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar la referencia',
                detalle: resultado.error
            });
        }
    }

    // Eliminar una referencia
    async eliminarReferencia(req, res) {
        const { id_referencia } = req.params;
        
        const resultado = await ReferenciaModel.eliminar(id_referencia);
        
        if (resultado.exito) {
            res.status(200).json({
                mensaje: 'Referencia eliminada exitosamente',
                id_referencia
            });
        } else if (resultado.noEncontrado) {
            res.status(404).json({
                error: 'No se encontró la referencia con el ID especificado'
            });
        } else {
            res.status(500).json({
                error: 'Error al eliminar la referencia',
                detalle: resultado.error
            });
        }
    }
}

module.exports = new ReferenciaController();