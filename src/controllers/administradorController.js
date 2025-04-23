const administradorModel = require('../models/administradorModel');

class AdministradorController {
    // Obtener todos los administradores
    async obtenerTodos(req, res) {
        try {
            const administradores = await administradorModel.obtenerTodos();
            res.status(200).json(administradores);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener los administradores',
                detalle: error.message
            });
        }
    }

    // Obtener administrador por ID
    async obtenerPorId(req, res) {
        const { id_admin } = req.params;

        try {
            const administrador = await administradorModel.obtenerPorId(id_admin);

            if (!administrador) {
                return res.status(404).json({
                    error: 'No se encontró el administrador con el ID especificado'
                });
            }

            res.status(200).json(administrador);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener el administrador',
                detalle: error.message
            });
        }
    }

    // Crear nuevo administrador
    async crear(req, res) {
        const { nombre, apellidos, correo_institucional, numero_empleado, rol_admin } = req.body;
        
        try {
            const id_admin = await administradorModel.crear({
                nombre, 
                apellidos, 
                correo_institucional, 
                numero_empleado, 
                rol_admin
            });
            
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
    }

    // Actualizar administrador
    async actualizar(req, res) {
        const { id_admin } = req.params;
        const datosActualizar = req.body;
        
        try {
            const resultado = await administradorModel.actualizar(id_admin, datosActualizar);
            
            if (!resultado) {
                return res.status(404).json({
                    error: 'No se encontró el administrador con el ID especificado'
                });
            }
            
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
    }

    // Eliminar administrador
    async eliminar(req, res) {
        const { id_admin } = req.params;
        
        try {
            const resultado = await administradorModel.eliminar(id_admin);
            
            if (!resultado) {
                return res.status(404).json({
                    error: 'No se encontró el administrador con el ID especificado'
                });
            }
            
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
    }
}

module.exports = new AdministradorController();