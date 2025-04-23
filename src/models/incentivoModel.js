const { db } = require('../firebase');

class IncentivoModel {
    // Obtener todos los incentivos
    async obtenerTodos() {
        const snapshot = await db.collection('incentivos').get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Crear nuevo incentivo
    async crear(incentivoData) {
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_incentivo = `me${randomNum}`;

        const nuevoIncentivo = {
            id_incentivo,
            ...incentivoData
        };

        await db.collection('incentivos').add(nuevoIncentivo);
        return id_incentivo;
    }
}

module.exports = new IncentivoModel();