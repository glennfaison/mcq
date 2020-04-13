const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const ResultService = require('./result.service');

/**
 *  @swagger
 *  paths:
 *    /api/v1/results/submit:
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
router.post('/results/submit', async (req, res, next) => {
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
router.get('/results', async (req, res, next) => {
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
router.get('/results/:id', async (req, res, next) => {
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

module.exports = router;
