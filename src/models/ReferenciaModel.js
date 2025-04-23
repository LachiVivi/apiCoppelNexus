// models/ReferenciaModel.js
const { db } = require('../firebase');

class ReferenciaModel {
    // Obtener todas las referencias
    async obtenerTodas() {
        try {
            const querySnapshot = await db.collection('referencias').get();
            
            const referencias = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return {
                exito: true,
                datos: referencias
            };
        } catch (error) {
            return {
                exito: false,
                error: error.message
            };
        }
    }

    // Obtener una referencia por ID
    async obtenerPorId(id_referencia) {
        try {
            const referenciasRef = db.collection('referencias');
            const snapshot = await referenciasRef.where('id_referencia', '==', id_referencia).get();

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

    // Crear una nueva referencia
    async crear(datos) {
        try {
            // Generar ID aleatorio de 3 dígitos
            const randomNum = Math.floor(Math.random() * 900) + 100;
            const id_referencia = `ref${randomNum}`;

            // Obtener fecha actual en formato AAAA-MM-DD
            const fecha_actual = new Date().toISOString().split('T')[0];

            const nuevaReferencia = {
                id_referencia,
                ...datos,
                estado_referencia: "pendiente",
                fecha_referencia: fecha_actual,
                historial_estados: [
                    {
                        estado: "pendiente",
                        fecha: fecha_actual
                    }
                ]
            };

            await db.collection('referencias').add(nuevaReferencia);
            
            return {
                exito: true,
                id_referencia
            };
        } catch (error) {
            return {
                exito: false,
                error: error.message
            };
        }
    }

    // Actualizar el estado de una referencia
    async actualizarEstado(id_referencia, nuevo_estado) {
        try {
            // Buscar la referencia por ID
            const referenciasRef = db.collection('referencias');
            const snapshot = await referenciasRef.where('id_referencia', '==', id_referencia).get();
            
            if (snapshot.empty) {
                return {
                    exito: false,
                    noEncontrado: true
                };
            }
            
            // Obtener fecha actual en formato AAAA-MM-DD
            const fecha_actual = new Date().toISOString().split('T')[0];
            
            // Obtener la referencia actual
            const docRef = snapshot.docs[0].ref;
            const referenciaActual = snapshot.docs[0].data();
            
            // Crear el nuevo estado para el historial
            const nuevoEstado = {
                estado: nuevo_estado,
                fecha: fecha_actual
            };
            
            // Actualizar la referencia con el nuevo estado y añadirlo al historial
            await docRef.update({
                estado_referencia: nuevo_estado,
                historial_estados: [...referenciaActual.historial_estados, nuevoEstado]
            });
            
            return {
                exito: true,
                id_referencia
            };
        } catch (error) {
            return {
                exito: false,
                error: error.message
            };
        }
    }

    // Eliminar una referencia
    async eliminar(id_referencia) {
        try {
            // Buscar la referencia por ID
            const referenciasRef = db.collection('referencias');
            const snapshot = await referenciasRef.where('id_referencia', '==', id_referencia).get();
            
            if (snapshot.empty) {
                return {
                    exito: false,
                    noEncontrado: true
                };
            }
            
            // Eliminar la referencia
            await snapshot.docs[0].ref.delete();
            
            return {
                exito: true,
                id_referencia
            };
        } catch (error) {
            return {
                exito: false,
                error: error.message
            };
        }
    }
}

module.exports = new ReferenciaModel();