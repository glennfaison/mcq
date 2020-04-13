const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const QuizService = require('./quiz.service');
const ResultService = require('../result/result.service');

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes:
 *      post:
 *        summary: Create quiz
 *        description: Create a new `Quiz`
 *        tags:
 *          - Quizzes
 *        operationId: create
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Quiz'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Quiz'
 */
router.post('/quizzes', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await QuizService.create(req.body.quiz);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes:
 *      get:
 *        summary: list quizzes
 *        description: Fetch a list of quizzes
 *        tags:
 *          - Quizzes
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Quiz'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Quiz'
 */
router.get('/quizzes', async (req, res, next) => {
  try {
    const data = await QuizService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes/{id}:
 *      get:
 *        summary: Get quiz
 *        description: Get a quiz by id
 *        tags:
 *          - Quizzes
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the quiz to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Quiz'
 */
router.get('/quizzes/:id', async (req, res, next) => {
  try {
    const data = await QuizService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes/{id}:
 *      put:
 *        summary: Update quiz
 *        description: Fetch a quiz by id and update
 *        tags:
 *          - Quizzes
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Quiz'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the quiz to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Quiz'
 */
router.put('/quizzes/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await QuizService.findByIdAndUpdate(req.params.id, req.body.quiz);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes/{id}:
 *      delete:
 *        summary: Delete quiz
 *        description: Fetch a quiz by id and delete
 *        tags:
 *          - Quizzes
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the quiz to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/quizzes/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await QuizService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes/{id}/submit:
 *      post:
 *        summary: Submit Quiz
 *        description: Submit an answered Quiz for evaluation
 *        tags:
 *          - Results
 *        operationId: submit
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Result'
 *        responses:
 *          202:
 *            description: Accepted
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Result'
 */
router.post('/quizzes/:id/submit', async (req, res, next) => {
  try {
    const data = await ResultService.create(req.body.quiz);
    return res.status(HttpStatus.ACCEPTED).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes/{id}/result:
 *      get:
 *        summary: Get Quiz result
 *        description: Fetch result of an evaluated Quiz
 *        tags:
 *          - Results
 *        operationId: submit
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the quiz to fetch results for
 *        responses:
 *          202:
 *            description: Accepted
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Result'
 */
router.get('/quizzes/:id/result', async (req, res, next) => {
  try {
    const data = await ResultService.findOne({ quizId: req.params.id, userId: req.auth.id });
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
