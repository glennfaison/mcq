const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const PrivilegeService = require('./privilege.service');

/**
 *  @swagger
 *  paths:
 *    /api/v1/privileges:
 *      post:
 *        summary: Create privilege
 *        description: Create a new `Privilege`
 *        tags:
 *          - Privileges
 *        operationId: create
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Privilege'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Privilege'
 */
router.post('/privileges', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await PrivilegeService.create(req.body.privilege);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/privileges:
 *      get:
 *        summary: list privileges
 *        description: Fetch a list of privileges
 *        tags:
 *          - Privileges
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Privilege'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Privilege'
 */
router.get('/privileges', async (req, res, next) => {
  try {
    const data = await PrivilegeService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/privileges/{id}:
 *      get:
 *        summary: Get privilege
 *        description: Get a privilege by id
 *        tags:
 *          - Privileges
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the privilege to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Privilege'
 */
router.get('/privileges/:id', async (req, res, next) => {
  try {
    const data = await PrivilegeService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/privileges/{id}:
 *      put:
 *        summary: Update privilege
 *        description: Fetch a privilege by id and update
 *        tags:
 *          - Privileges
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Privilege'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the privilege to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Privilege'
 */
router.put('/privileges/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await PrivilegeService.findByIdAndUpdate(req.params.id, req.body.privilege);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/privileges/{id}:
 *      delete:
 *        summary: Delete privilege
 *        description: Fetch a privilege by id and delete
 *        tags:
 *          - Privileges
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the privilege to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/privileges/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await PrivilegeService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
