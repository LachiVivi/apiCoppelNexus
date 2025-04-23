const colaboradorModel = require('../models/colaboradorModel');

class ColaboradorController {
    // Obtener todos los colaboradores
    async obtenerTodos(req, res) {
        try {
            const colaboradores = await colaboradorModel.obtenerTodos();
            res.status(200).json(colaboradores);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener los colaboradores',
                detalle: error.message
            });
        }
    }

    // Obtener colaborador por número de empleado
    async obtenerPorNumeroEmpleado(req, res) {
        const { numero_empleado } = req.params;

        try {
            const colaborador = await colaboradorModel.obtenerPorNumeroEmpleado(numero_empleado);

            if (!colaborador) {
                return res.status(404).json({
                    error: 'No se encontró el colaborador con el número de empleado especificado'
                });
            }

            res.status(200).json(colaborador);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener el colaborador',
                detalle: error.message
            });
        }
    }

    // Crear nuevo colaborador
    async crear(req, res) {
        try {
            const { nombre, apellidos, numero_empleado, zona_actual, contrasenia, foto_perfil_url } = req.body;
            
            const id_colaborador = await colaboradorModel.crear({
                nombre,
                apellidos,
                numero_empleado,
                zona_actual,
                contrasenia,
                foto_perfil_url
            });
            
            res.status(201).json({
                mensaje: 'Colaborador creado exitosamente',
                id_colaborador
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al crear el colaborador',
                detalle: error.message
            });
        }
    }

    // Actualizar colaborador
    async actualizar(req, res) {
        const { numero_empleado } = req.params;
        const datos = req.body;
        
        try {
            const updateData = {};
            
            if (datos.nombre) updateData.nombre = datos.nombre;
            if (datos.apellidos) updateData.apellidos = datos.apellidos;
            if (datos.nuevo_numero_empleado) updateData.numero_empleado = datos.nuevo_numero_empleado;
            if (datos.zona_actual) updateData.zona_actual = datos.zona_actual;
            if (datos.contrasenia) updateData.contrasenia = datos.contrasenia;
            if (datos.foto_perfil_url) updateData.foto_perfil_url = datos.foto_perfil_url;
            
            const resultado = await colaboradorModel.actualizar(numero_empleado, updateData);
            
            if (!resultado) {
                return res.status(404).json({
                    error: 'No se encontró el colaborador con el número de empleado especificado'
                });
            }
            
            res.status(200).json({
                mensaje: 'Colaborador actualizado exitosamente',
                numero_empleado: resultado
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al actualizar el colaborador',
                detalle: error.message
            });
        }
    }

    // Eliminar colaborador
    async eliminar(req, res) {
        const { numero_empleado } = req.params;
        
        try {
            const resultado = await colaboradorModel.eliminar(numero_empleado);
            
            if (!resultado) {
                return res.status(404).json({
                    error: 'No se encontró el colaborador con el número de empleado especificado'
                });
            }
            
            res.status(200).json({
                mensaje: 'Colaborador eliminado exitosamente',
                numero_empleado
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error al eliminar el colaborador',
                detalle: error.message
            });
        }
    }
}

module.exports = new ColaboradorController();