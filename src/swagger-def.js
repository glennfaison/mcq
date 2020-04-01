const swaggerJSDoc = require('swagger-jsdoc');

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerDocument = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'MCQ', // Title (required)
      version: '1.0.0' // Version (required)
    }
  },
  apis: [
    'src/**/*.js'
  ]
});

module.exports = swaggerDocument;
