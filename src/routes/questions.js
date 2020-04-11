const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const authGuard = require('../middleware/auth-guard');
const adminGuard = require('../middleware/admin-guard');
const QuestionService = require('../services/question');

/**
 *  @swagger
 *  paths:
 *    /api/v1/questions:
 *      post:
 *        summary: Create question
 *        description: Create a new `Question`
 *        tags:
 *          - Questions
 *        operationId: create
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Question'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Question'
 */
router.post('/questions', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await QuestionService.create(req.body.question);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/questions:
 *      get:
 *        summary: list questions
 *        description: Fetch a list of questions
 *        tags:
 *          - Questions
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Question'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Question'
 */
router.get('/questions', async (req, res, next) => {
  try {
    const data = await QuestionService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/questions/{id}:
 *      get:
 *        summary: Get question
 *        description: Get a question by id
 *        tags:
 *          - Questions
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the question to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Question'
 */
router.get('/questions/:id', async (req, res, next) => {
  try {
    const data = await QuestionService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/questions/{id}:
 *      put:
 *        summary: Update question
 *        description: Fetch a question by id and update
 *        tags:
 *          - Questions
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Question'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the question to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Question'
 */
router.put('/questions/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await QuestionService.findByIdAndUpdate(req.params.id, req.body.question);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/questions/{id}:
 *      delete:
 *        summary: Delete question
 *        description: Fetch a question by id and delete
 *        tags:
 *          - Questions
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the question to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/questions/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await QuestionService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
