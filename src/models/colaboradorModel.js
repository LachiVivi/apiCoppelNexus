const { db } = require('../firebase');

class ColaboradorModel {
    // Obtener todos los colaboradores
    async obtenerTodos() {
        const querySnapshot = await db.collection('colaboradores').get();
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Obtener colaborador por número de empleado
    async obtenerPorNumeroEmpleado(numero_empleado) {
        const colaboradoresRef = db.collection('colaboradores');
        const snapshot = await colaboradoresRef.where('numero_empleado', '==', numero_empleado).get();

        if (snapshot.empty) {
            return null;
        }

        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        };
    }

    // Crear nuevo colaborador
    async crear(colaboradorData) {
        //Id de colaborador aleatorio
        const randomNum = Math.floor(Math.random() * 900) + 100;
        const id_colaborador = `col${randomNum}`;
        
        //Fecha actual
        const fecha_registro = new Date().toISOString().split('T')[0];
        
        const nuevoColaborador = {
            id_colaborador,
            ...colaboradorData,
            fecha_registro,
            incentivos_canjeados: [],
            registro_actividades: [],
            notificaciones: [],
            rutas: []
        };

        await db.collection('colaboradores').add(nuevoColaborador);
        return id_colaborador;
    }

    // Actualizar colaborador
    async actualizar(numero_empleado, datosActualizar) {
        const colaboradoresRef = db.collection('colaboradores');
        const snapshot = await colaboradoresRef.where('numero_empleado', '==', numero_empleado).get();
        
        if (snapshot.empty) {
            return null;
        }
        
        const updates = [];
        snapshot.forEach(doc => {
            updates.push(doc.ref.update(datosActualizar));
        });

        await Promise.all(updates);
        return datosActualizar.nuevo_numero_empleado || numero_empleado;
    }

    // Eliminar colaborador
    async eliminar(numero_empleado) {
        const colaboradoresRef = db.collection('colaboradores');
        const snapshot = await colaboradoresRef.where('numero_empleado', '==', numero_empleado).get();
        
        if (snapshot.empty) {
            return null;
        }
        
        const deletes = [];
        snapshot.forEach(doc => {
            deletes.push(doc.ref.delete());
        });

        await Promise.all(deletes);
        return numero_empleado;
    }
}

module.exports = new ColaboradorModel();