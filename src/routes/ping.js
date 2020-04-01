const HttpStatus = require('http-status-codes');
const router = require('express').Router();

/**
 *  @swagger
 *  /ping:
 *    get:
 *      description: Ping the server to check if it's online
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
