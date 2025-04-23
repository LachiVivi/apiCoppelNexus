const { db } = require('../firebase');

class MicroempresarioModel {
    // Crear un nuevo microempresario
    async crear(microempresarioData) {
        try {
            // Generar ID aleatorio de 3 dígitos
            const randomNum = Math.floor(Math.random() * 900) + 100;
            const id_microempresario = `me${randomNum}`;
            
            // Obtener fecha actual en formato AAAA-MM-DD
            const fecha_registro = new Date().toISOString().split('T')[0];

            const nuevoMicroempresario = {
                id_microempresario,
                ...microempresarioData,
                fecha_registro
            };

            await db.collection('microempresarios').add(nuevoMicroempresario);
            return { 
                exito: true, 
                id_microempresario 
            };
        } catch (error) {
            return { 
                exito: false, 
                error: error.message 
            };
        }
    }

    // Obtener todos los microempresarios
    async obtenerTodos() {
        try {
            const snapshot = await db.collection('microempresarios').get();
            return {
                exito: true,
                datos: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            };
        } catch (error) {
            return { 
                exito: false, 
                error: error.message 
            };
        }
    }

    // Obtener un microempresario por ID
    async obtenerPorId(id_microempresario) {
        try {
            const snapshot = await db.collection('microempresarios')
                .where('id_microempresario', '==', id_microempresario)
                .get();

            if (snapshot.empty) {
                return { 
                    exito: false, 
                    noEncontrado: true 
                };
            }

            return {
                exito: true,
                datos: {
                    id: snapshot.docs[0].id,
                    ...snapshot.docs[0].data()
                }
            };
        } catch (error) {
            return { 
                exito: false, 
                error: error.message 
            };
        }
    }

    // Actualizar un microempresario
    async actualizar(id_microempresario, datosActualizados) {
        try {
            const snapshot = await db.collection('microempresarios')
                .where('id_microempresario', '==', id_microempresario)
                .get();

            if (snapshot.empty) {
                return { 
                    exito: false, 
                    noEncontrado: true 
                };
            }

            await snapshot.docs[0].ref.update(datosActualizados);
            return { 
                exito: true, 
                id_microempresario 
            };
        } catch (error) {
            return { 
                exito: false, 
                error: error.message 
            };
        }
    }

    // Eliminar un microempresario
    async eliminar(id_microempresario) {
        try {
            const snapshot = await db.collection('microempresarios')
                .where('id_microempresario', '==', id_microempresario)
                .get();

            if (snapshot.empty) {
                return { 
                    exito: false, 
                    noEncontrado: true 
                };
            }

            await snapshot.docs[0].ref.delete();
            return { 
                exito: true, 
                id_microempresario 
            };
        } catch (error) {
            return { 
                exito: false, 
                error: error.message 
            };
        }
    }
}

module.exports = new MicroempresarioModel();