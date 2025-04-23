const MicroempresarioModel = require('../models/MicroempresarioModel');

class MicroempresarioController {
    async crearMicroempresario(req, res) {
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

        const microempresarioData = {
            nombre,
            apellidos,
            telefono,
            correo_electronico,
            nombre_negocio,
            tipo_negocio,
            foto_negocio_url,
            ubicacion,
            coordenadas_geograficas
        };

        const resultado = await MicroempresarioModel.crear(microempresarioData);

        if (resultado.exito) {
            res.status(201).json({
                mensaje: 'Microempresario creado exitosamente',
                id_microempresario: resultado.id_microempresario
            });
        } else {
            res.status(500).json({
                error: 'Error al crear el microempresario',
                detalle: resultado.error
            });
        }
    }

    async obtenerTodosMicroempresarios(req, res) {
        const resultado = await MicroempresarioModel.obtenerTodos();

        if (resultado.exito) {
            res.status(200).json(resultado.datos);
        } else {
            res.status(500).json({
                error: 'Error al obtener microempresarios',
                detalle: resultado.error
            });
        }
    }

    async obtenerMicroempresarioPorId(req, res) {
        const { id_microempresario } = req.params;
        const resultado = await MicroempresarioModel.obtenerPorId(id_microempresario);

        if (resultado.exito) {
            res.status(200).json(resultado.datos);
        } else if (resultado.noEncontrado) {
            res.status(404).json({
                error: 'No se encontró el microempresario con el ID especificado'
            });
        } else {
            res.status(500).json({
                error: 'Error al obtener el microempresario',
                detalle: resultado.error
            });
        }
    }

    async actualizarMicroempresario(req, res) {
        const { id_microempresario } = req.params;
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

        // Primero obtener el microempresario actual
        const microempresarioActual = await MicroempresarioModel.obtenerPorId(id_microempresario);
        
        if (!microempresarioActual.exito) {
            if (microempresarioActual.noEncontrado) {
                return res.status(404).json({
                    error: 'No se encontró el microempresario con el ID especificado'
                });
            } else {
                return res.status(500).json({
                    error: 'Error al obtener el microempresario',
                    detalle: microempresarioActual.error
                });
            }
        }

        // Preparar datos actualizados
        const updateData = {};
        
        if (nombre) updateData.nombre = nombre;
        if (apellidos) updateData.apellidos = apellidos;
        if (telefono) updateData.telefono = telefono;
        if (correo_electronico) updateData.correo_electronico = correo_electronico;
        if (nombre_negocio) updateData.nombre_negocio = nombre_negocio;
        if (tipo_negocio) updateData.tipo_negocio = tipo_negocio;
        if (foto_negocio_url) updateData.foto_negocio_url = foto_negocio_url;
        
        if (ubicacion) {
            const datosActuales = microempresarioActual.datos;
            updateData.ubicacion = {
                estado: ubicacion.estado || datosActuales.ubicacion.estado,
                municipio: ubicacion.municipio || datosActuales.ubicacion.municipio,
                colonia: ubicacion.colonia || datosActuales.ubicacion.colonia,
                codigo_postal: ubicacion.codigo_postal || datosActuales.ubicacion.codigo_postal,
                calle: ubicacion.calle || datosActuales.ubicacion.calle,
                numero_edificio: ubicacion.numero_edificio || datosActuales.ubicacion.numero_edificio
            };
        }
        
        if (coordenadas_geograficas) {
            const datosActuales = microempresarioActual.datos;
            updateData.coordenadas_geograficas = {
                latitud: coordenadas_geograficas.latitud || datosActuales.coordenadas_geograficas.latitud,
                longitud: coordenadas_geograficas.longitud || datosActuales.coordenadas_geograficas.longitud
            };
        }

        // Actualizar el documento
        const resultado = await MicroempresarioModel.actualizar(id_microempresario, updateData);
        
        if (resultado.exito) {
            res.status(200).json({
                mensaje: 'Microempresario actualizado exitosamente',
                id_microempresario
            });
        } else if (resultado.noEncontrado) {
            res.status(404).json({
                error: 'No se encontró el microempresario con el ID especificado'
            });
        } else {
            res.status(500).json({
                error: 'Error al actualizar el microempresario',
                detalle: resultado.error
            });
        }
    }

    async eliminarMicroempresario(req, res) {
        const { id_microempresario } = req.params;
        const resultado = await MicroempresarioModel.eliminar(id_microempresario);

        if (resultado.exito) {
            res.status(200).json({
                mensaje: 'Microempresario eliminado exitosamente',
                id_microempresario
            });
        } else if (resultado.noEncontrado) {
            res.status(404).json({
                error: 'No se encontró el microempresario con el ID especificado'
            });
        } else {
            res.status(500).json({
                error: 'Error al eliminar el microempresario',
                detalle: resultado.error
            });
        }
    }
}

module.exports = new MicroempresarioController();