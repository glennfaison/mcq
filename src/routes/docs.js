const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const HttpStatus = require('http-status-codes');

const swaggerDocument = require('../swagger-def');

/**
 *  @swagger
 *  /api/v1/openapi.json:
 *    get:
 *      description: Fetch the OpenAPI specifications for this API as a JSON file
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: OpenAPI Specifications
 */
router.get('/openapi.json', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(HttpStatus.OK).json(swaggerDocument);
});

/**
 *  @swagger
 *  /api/v1/docs:
 *  description: A Swagger UI documentation for this API
 */
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
