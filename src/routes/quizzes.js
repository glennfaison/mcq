const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const authGuard = require('../middleware/auth-guard');
const adminGuard = require('../middleware/admin-guard');
const Quizzeservice = require('../services/quiz');

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
    const data = await Quizzeservice.create(req.body.quiz);
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
    const data = await Quizzeservice.find(req.query);
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
    const data = await Quizzeservice.findById(req.params.id);
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
    const data = await Quizzeservice.findByIdAndUpdate(req.params.id, req.body.quiz);
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
    await Quizzeservice.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
