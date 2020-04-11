const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const authGuard = require('../middleware/auth-guard');
const adminGuard = require('../middleware/admin-guard');
const RoleService = require('../services/role');

/**
 *  @swagger
 *  paths:
 *    /api/v1/roles:
 *      post:
 *        summary: Create role
 *        description: Create a new `Role`
 *        tags:
 *          - Roles
 *        operationId: create
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Role'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Role'
 */
router.post('/roles', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await RoleService.create(req.body.role);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/roles:
 *      get:
 *        summary: list roles
 *        description: Fetch a list of roles
 *        tags:
 *          - Roles
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Role'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Role'
 */
router.get('/roles', async (req, res, next) => {
  try {
    const data = await RoleService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/roles/{id}:
 *      get:
 *        summary: Get role
 *        description: Get a role by id
 *        tags:
 *          - Roles
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the role to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Role'
 */
router.get('/roles/:id', async (req, res, next) => {
  try {
    const data = await RoleService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/roles/{id}:
 *      put:
 *        summary: Update role
 *        description: Fetch a role by id and update
 *        tags:
 *          - Roles
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Role'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the role to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Role'
 */
router.put('/roles/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await RoleService.findByIdAndUpdate(req.params.id, req.body.role);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/roles/{id}:
 *      delete:
 *        summary: Delete role
 *        description: Fetch a role by id and delete
 *        tags:
 *          - Roles
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the role to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/roles/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await RoleService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
