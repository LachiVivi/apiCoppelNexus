const { db } = require('../firebase');

class AdministradorModel {
    // Obtener todos los administradores
    async obtenerTodos() {
        const querySnapshot = await db.collection('administradores').get();
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Obtener administrador por ID
    async obtenerPorId(id_admin) {
        const adminsRef = db.collection('administradores');
        const snapshot = await adminsRef.where('id_admin', '==', id_admin).get();

        if (snapshot.empty) {
            return null;
        }

        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        };
    }

    // Crear nuevo administrador
    async crear(administradorData) {
        // Generar ID aleatorio de 3 dígitos
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_admin = `admin${randomNum}`;

        // Obtener fecha actual en formato AAAA-MM-DD
        const fecha_registro = new Date().toISOString().split('T')[0];

        const nuevoAdministrador = {
            id_admin,
            ...administradorData,
            fecha_registro,
            estado: "activo",
            registro_actividades: []
        };

        await db.collection('administradores').add(nuevoAdministrador);
        return id_admin;
    }

    // Actualizar administrador
    async actualizar(id_admin, datosActualizar) {
        const adminsRef = db.collection('administradores');
        const snapshot = await adminsRef.where('id_admin', '==', id_admin).get();
        
        if (snapshot.empty) {
            return null;
        }
        
        const docRef = snapshot.docs[0].ref;
        await docRef.update(datosActualizar);
        return id_admin;
    }

    // Eliminar administrador
    async eliminar(id_admin) {
        const adminsRef = db.collection('administradores');
        const snapshot = await adminsRef.where('id_admin', '==', id_admin).get();
        
        if (snapshot.empty) {
            return null;
        }
        
        await snapshot.docs[0].ref.delete();
        return id_admin;
    }
}

module.exports = new AdministradorModel();