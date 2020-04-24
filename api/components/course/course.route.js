const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const { authGuard, adminGuard } = require('../../middleware');
const CourseService = require('./course.service');

const router = Router();

/**
 *  @swagger
 *  paths:
 *    /api/v1/courses:
 *      post:
 *        summary: Create course
 *        description: Create a new `Course`
 *        tags:
 *          - Courses
 *        operationId: create
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Course'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Course'
 */
router.post('/courses', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await CourseService.create(req.body.course);
    return res.status(HttpStatus.CREATED).json({ data });
  } catch (e) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/courses:
 *      get:
 *        summary: list courses
 *        description: Fetch a list of courses
 *        tags:
 *          - Courses
 *        operationId: list
 *        parameters:
 *          - in: query
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Course'
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Course'
 */
router.get('/courses', async (req, res, next) => {
  try {
    const data = await CourseService.find(req.query);
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/courses/{id}:
 *      get:
 *        summary: Get course
 *        description: Get a course by id
 *        tags:
 *          - Courses
 *        operationId: getById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the course to fetch
 *        responses:
 *          200:
 *            description: Ok
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Course'
 */
router.get('/courses/:id', async (req, res, next) => {
  try {
    const data = await CourseService.findById(req.params.id);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/courses/{id}:
 *      put:
 *        summary: Update course
 *        description: Fetch a course by id and update
 *        tags:
 *          - Courses
 *        operationId: updateById
 *        parameters:
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                $ref: '#/components/schemas/Course'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the course to update
 *        responses:
 *          200:
 *            description: OK
 *            content:
 *              apppliaction/json:
 *                schema:
 *                  $ref: '#/components/schemas/Course'
 */
router.put('/courses/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const data = await CourseService.findByIdAndUpdate(req.params.id, req.body.course);
    if (!data) { return res.sendStatus(HttpStatus.NOT_FOUND); }
    return res.status(HttpStatus.OK).json({ data });
  } catch (e) {
    next(e);
  }
});

/**
 *  @swagger
 *  paths:
 *    /api/v1/courses/{id}:
 *      delete:
 *        summary: Delete course
 *        description: Fetch a course by id and delete
 *        tags:
 *          - Courses
 *        operationId: deleteById
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the course to delete
 *        responses:
 *          204:
 *            description: No Content
 */
router.delete('/courses/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    await CourseService.findByIdAndDelete(req.params.id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
