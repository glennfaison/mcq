const { Router } = require('express');

const pingRoutes = require('./ping/ping.route');
const docsRoutes = require('./docs/docs.route');
const authRoutes = require('./auth/auth.route');
const userRoutes = require('./user/user.route');
const courseRoutes = require('./course/course.route');
const topicRoutes = require('./topic/topic.route');
const questionRoutes = require('./question/question.route');
const quizRoutes = require('./quiz/quiz.route');
const resultRoutes = require('./result/result.route');
const roleRoutes = require('./role/role.route');
const privilegeRoutes = require('./privilege/privilege.route');

const router = Router();
const baseApi = '/api/v1';

// Perform the final set up of routes here
router.use('/', pingRoutes);
router.use(baseApi, docsRoutes);
router.use(baseApi, authRoutes);
router.use(baseApi, userRoutes);
router.use(baseApi, courseRoutes);
router.use(baseApi, topicRoutes);
router.use(baseApi, questionRoutes);
router.use(baseApi, quizRoutes);
router.use(baseApi, resultRoutes);
router.use(baseApi, roleRoutes);
router.use(baseApi, privilegeRoutes);

module.exports = router;
