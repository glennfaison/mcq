const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const UserService = require('./user.service');

const router = Router();

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/me:
 *      get:
 *        summary: My User details
 *        description: Fetch the requester's user details
 *        tags:
 *          - Users
 *        operationId: me
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.get('/users/me', authGuard, async (req, res, next) => {
  try {
    return res.status(HttpStatus.OK).json({ data: req.auth });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users:
 *      get:
 *        summary: list users
 *        description: Fetch a list of users
 *        tags:
 *          - Users
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 */
router.get('/users', async (req, res, next) => {
  try {
    const data = await UserService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/{id}:
 *      get:
 *        summary: Get user
 *        description: Get a user by id
 *        tags:
 *          - Users
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the user to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const data = await UserService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/me:
 *      put:
 *        summary: Update user
 *        description: Fetch the requester's user details and update
 *        tags:
 *          - Users
 *        operationId: updateMe
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.put('/users/me', authGuard, async (req, res, next) => {
  try {
    const data = await UserService.findByIdAndUpdate(req.auth.id, req.body.user);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/{id}:
 *      put:
 *        summary: Update user
 *        description: Fetch a user by id and update
 *        tags:
 *          - Users
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/User'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the user to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
router.put('/users/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await UserService.findByIdAndUpdate(req.params.id, req.body.user);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/me:
 *      delete:
 *        summary: delete user
 *        description: Fetch the requester's user details and delete
 *        tags:
 *          - Users
 *        operationId: deleteMe
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/User'
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/users/me', authGuard, async (req, res, next) => {
  try {
    await UserService.findByIdAndDelete(req.auth.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/{id}:
 *      delete:
 *        summary: Delete user
 *        description: Fetch a user by id and delete
 *        tags:
 *          - Users
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the user to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/users/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await UserService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
