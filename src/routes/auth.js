const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const AuthService = require('../services/auth');

/**
 *  @swagger
 *  paths:
 *    /api/v1/auth/register:
 *      post:
 *        summary: Register
 *        description: Creates a user and returns the newly created object
 *        tags:
 *          - Auth
 *        operationId: register
 *        requestBody:
 *          required: true
 *          description: the user's information.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          201:
 *            description: Created
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.post('/auth/register', async (req, res, next) => {
  try {
    const data = await AuthService.register(req.body.user);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/auth/login:
 *      post:
 *        summary: Sign in
 *        description: Sign in by creating a new session
 *        tags:
 *          - Auth
 *        operationId: login
 *        requestBody:
 *          required: true
 *          description: the user's information.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.post('/auth/login', async (req, res, next) => {
  try {
    const data = AuthService.login(req.body.user);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e);
  }
});

router.post('/auth/forgot-password', (req, res, next) => {
  return next();
});

module.exports = router;
