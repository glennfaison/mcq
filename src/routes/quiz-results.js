const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const authGuard = require('../middleware/auth-guard');
const adminGuard = require('../middleware/admin-guard');
const QuizResultService = require('../services/quiz-result');

/**
 *  @swagger
 *  paths:
 *    /api/v1/quiz-results:
 *      get:
 *        summary: list quiz results
 *        description: Fetch a list of `QuizResults`
 *        tags:
 *          - QuizResults
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/QuizResult'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/QuizResult'
 */
router.get('/quiz-results', async (req, res, next) => {
  try {
    const data = await QuizResultService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quiz-results/{id}:
 *      get:
 *        summary: Get quiz result
 *        description: Get a `QuizResult` by id
 *        tags:
 *          - QuizResults
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the QuizResult to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/QuizResult'
 */
router.get('/quiz-results/:id', async (req, res, next) => {
  try {
    const data = await QuizResultService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/quiz-results/{id}:
 *      delete:
 *        summary: Delete quiz result
 *        description: Fetch a `QuizResult` by id and delete
 *        tags:
 *          - QuizResults
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the QuizResult to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/quiz-results/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await QuizResultService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
