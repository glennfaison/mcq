const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const TopicService = require('./topic.service');

/**
 *  @swagger
 *  paths:
 *    /api/v1/topics:
 *      post:
 *        summary: Create topic
 *        description: Create a new `Topic`
 *        tags:
 *          - Topics
 *        operationId: create
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Topic'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Topic'
 */
router.post('/topics', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await TopicService.create(req.body.topic);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/topics:
 *      get:
 *        summary: list topics
 *        description: Fetch a list of topics
 *        tags:
 *          - Topics
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Topic'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Topic'
 */
router.get('/topics', async (req, res, next) => {
  try {
    const data = await TopicService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/topics/{id}:
 *      get:
 *        summary: Get topic
 *        description: Get a topic by id
 *        tags:
 *          - Topics
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the topic to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Topic'
 */
router.get('/topics/:id', async (req, res, next) => {
  try {
    const data = await TopicService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/topics/{id}:
 *      put:
 *        summary: Update topic
 *        description: Fetch a topic by id and update
 *        tags:
 *          - Topics
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Topic'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the topic to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Topic'
 */
router.put('/topics/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await TopicService.findByIdAndUpdate(req.params.id, req.body.topic);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/topics/{id}:
 *      delete:
 *        summary: Delete topic
 *        description: Fetch a topic by id and delete
 *        tags:
 *          - Topics
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the topic to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/topics/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await TopicService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
