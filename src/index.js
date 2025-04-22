const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { db } = require('./firebase');
const { swaggerDocs } = require('./swagger'); 

// Iniciamos la documentación de Swagger
swaggerDocs(app);

// iniciamos configurando el websocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Escuchar cuando un cliente se suscribe a una colección
  socket.on('suscribir_coleccion', (coleccion) => {
    console.log(`Cliente ${socket.id} suscrito a ${coleccion}`);
    
    // Genera un ID único para el listener y poder eliminarlo después
    const listenerId = `${socket.id}_${coleccion}`;
    
    // Guardamos la referencia del listener para limpiar despues
    socket.listenerIds = socket.listenerIds || [];
    socket.listenerIds.push(listenerId);
    
    // Creamos un listener de Firestore para enviar actualizaciones en tiempo real
    const unsubscribe = db.collection(coleccion)
      .onSnapshot((snapshot) => {
        const cambios = [];
        snapshot.docChanges().forEach((change) => {
          cambios.push({
            tipo: change.type,
            id: change.doc.id,
            datos: change.doc.data()
          });
        });
        
        if (cambios.length > 0) {
          socket.emit('actualizacion_coleccion', {
            coleccion,
            cambios
          });
        }
      }, (error) => {
        console.error(`Error en listener de ${coleccion}:`, error);
        socket.emit('error', { mensaje: `Error al observar ${coleccion}: ${error.message}` });
      });
    
    // Guardamos la función de limpieza para eliminar el listener después
    socket.unsubscribeFunctions = socket.unsubscribeFunctions || {};
    socket.unsubscribeFunctions[listenerId] = unsubscribe;
  });

  // Escuchamos cuando un cliente se suscribe a un documento específico
  socket.on('suscribir_documento', ({ coleccion, id }) => {
    console.log(`Cliente ${socket.id} suscrito a ${coleccion}/${id}`);
    
    // Generamos un ID único para este listener
    const listenerId = `${socket.id}_${coleccion}_${id}`;
    
    // Guardamos la referencia del listener para limpiar despues
    socket.listenerIds = socket.listenerIds || [];
    socket.listenerIds.push(listenerId);
    
    // Creamos un listener para un documento específico
    const unsubscribe = db.collection(coleccion).doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          socket.emit('actualizacion_documento', {
            coleccion,
            id: doc.id,
            datos: doc.data(),
            existe: true
          });
        } else {
          socket.emit('actualizacion_documento', {
            coleccion,
            id,
            existe: false
          });
        }
      }, (error) => {
        console.error(`Error en listener de ${coleccion}/${id}:`, error);
        socket.emit('error', { mensaje: `Error al observar ${coleccion}/${id}: ${error.message}` });
      });
    
    // Guardamos la función de limpieza
    socket.unsubscribeFunctions = socket.unsubscribeFunctions || {};
    socket.unsubscribeFunctions[listenerId] = unsubscribe;
  });

  // Escuchamos cuándo un cliente quiere cancelar la suscripción a una colección
  socket.on('cancelar_suscripcion', (listenerId) => {
    if (socket.unsubscribeFunctions && socket.unsubscribeFunctions[listenerId]) {
      socket.unsubscribeFunctions[listenerId]();
      delete socket.unsubscribeFunctions[listenerId];
      console.log(`Suscripción ${listenerId} cancelada`);
    }
  });

  // Manejamos la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Limpiamos todos los listeners cuando el cliente se desconecta
    if (socket.unsubscribeFunctions) {
      Object.values(socket.unsubscribeFunctions).forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    }
  });
});

// Iniciamos el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000 con WebSocket');
  console.log('Documentación de la API disponible en http://localhost:3000/api-docs');
});