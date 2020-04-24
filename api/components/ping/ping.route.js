const HttpStatus = require('http-status-codes');
const { Router } = require('express');

const router = Router();

/**
 *  @swagger
 *  /ping:
 *    get:
 *      summary: ping
 *      description: Ping the server to check if it's online
 *      tags:
 *        - Ping
 *      operationId: ping
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: pong
 */
router.get('/ping', (req, res, next) => {
  return res.status(HttpStatus.OK).end('pong');
});

module.exports = router;
