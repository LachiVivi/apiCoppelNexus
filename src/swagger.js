const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración básica de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CoppelNexus',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema CoppelNexus',
      contact: {
        name: 'Equipo CoppelNexus'
      },
      servers: [{
        url: 'http://localhost:3000'
      }]
    },
    components: {
      schemas: {
        Colaborador: {
          type: 'object',
          properties: {
            id_colaborador: { type: 'string', example: 'col123' },
            nombre: { type: 'string', example: 'Juan' },
            apellidos: { type: 'string', example: 'Pérez López' },
            numero_empleado: { type: 'string', example: '12345' },
            zona_actual: { type: 'string', example: 'Norte' },
            contrasenia: { type: 'string', example: '******' },
            fecha_registro: { type: 'string', format: 'date', example: '2025-04-22' },
            foto_perfil_url: { type: 'string', example: 'https://example.com/foto.jpg' },
            incentivos_canjeados: { type: 'array', items: { type: 'object' } },
            registro_actividades: { type: 'array', items: { type: 'object' } },
            notificaciones: { type: 'array', items: { type: 'object' } },
            rutas: { type: 'array', items: { type: 'object' } }
          }
        },
        Microempresario: {
          type: 'object',
          properties: {
            id_microempresario: { type: 'string', example: 'me123' },
            nombre: { type: 'string', example: 'María' },
            apellidos: { type: 'string', example: 'González Ruiz' },
            telefono: { type: 'string', example: '6121234567' },
            correo_electronico: { type: 'string', example: 'maria@correo.com' },
            nombre_negocio: { type: 'string', example: 'Tienda María' },
            tipo_negocio: { type: 'string', example: 'Abarrotes' },
            foto_negocio_url: { type: 'string', example: 'https://example.com/negocio.jpg' },
            ubicacion: {
              type: 'object',
              properties: {
                estado: { type: 'string', example: 'Sinaloa' },
                municipio: { type: 'string', example: 'Culiacán' },
                colonia: { type: 'string', example: 'Centro' },
                codigo_postal: { type: 'string', example: '80000' },
                calle: { type: 'string', example: 'Av. Principal' },
                numero_edificio: { type: 'string', example: '123' }
              }
            },
            coordenadas_geograficas: {
              type: 'object',
              properties: {
                latitud: { type: 'number', example: 24.8087 },
                longitud: { type: 'number', example: -107.3940 }
              }
            },
            fecha_registro: { type: 'string', format: 'date', example: '2025-04-22' }
          }
        },
        Incentivo: {
          type: 'object',
          properties: {
            id_incentivo: { type: 'string', example: 'me123' },
            titulo: { type: 'string', example: 'Bono por ventas' },
            descripcion: { type: 'string', example: 'Bono por alcanzar meta mensual' }
          }
        },
        Zona: {
          type: 'object',
          properties: {
            id_zona: { type: 'string', example: 'me123' },
            nombre_zona: { type: 'string', example: 'Zona Norte' },
            estado: { type: 'string', example: 'Sinaloa' },
            municipios_incluidos: { type: 'array', items: { type: 'string' } },
            codigos_postales_relacionados: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Rutas donde están los endpoints
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerDocs = (app) => {
  // Ruta para acceder a la documentación de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Ruta para obtener el JSON de Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Documentación de Swagger disponible en /api-docs');
};

module.exports = { swaggerDocs };