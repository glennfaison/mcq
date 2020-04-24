const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const ResultService = require('./result.service');
const QuizService = require('../quiz/quiz.service');

const router = Router();

/**
 *  @swagger
 *  paths:
 *    /api/v1/results:
 *      get:
 *        summary: list quiz results
 *        description: Fetch a list of `Results`
 *        tags:
 *          - Results
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Result'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Result'
 */
router.get('/results', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await ResultService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/results/{id}:
 *      get:
 *        summary: Get quiz result
 *        description: Get a `Result` by id
 *        tags:
 *          - Results
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the Result to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Result'
 */
router.get('/results/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await ResultService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/results/{id}:
 *      delete:
 *        summary: Delete quiz result
 *        description: Fetch a `Result` by id and delete
 *        tags:
 *          - Results
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the Result to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/results/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await ResultService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/users/me/results:
 *      get:
 *        summary: list my quiz results
 *        description: Fetch the requester's `Results`
 *        tags:
 *          - Results
 *        operationId: listMyResults
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Result'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Result'
 */
router.get('/users/me/results', authGuard, async (req, res, next) => {
  try {
    req.query = { ...req.query, userId: req.auth.id };
    const data = await ResultService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quizzes/{id}/result:
 *      get:
 *        summary: Get Requester's Quiz result
 *        description: Fetch result of requester's evaluated Quiz
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
router.get('/quizzes/:id/result', authGuard, async (req, res, next) => {
  try {
    let { expiresAt } = await QuizService.findById(req.params.id);
    expiresAt = new Date(expiresAt);
    if (expiresAt.getTime() > Date.now()) {
      return res.status(HttpStatus.ACCEPTED).json({
        message: `The results are to be published on ${expiresAt.toLocaleDateString()}`
      });
    }
    const data = await ResultService.findOne({ quizId: req.params.id, userId: req.auth.id });
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
