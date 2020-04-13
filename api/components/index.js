const router = require('express').Router();

const baseApi = '/api/v1';

// Perform the final set up of routes here
router.use('/', require('./ping/ping.route'));
router.use(baseApi, require('./docs/docs.route'));
router.use(baseApi, require('./auth/auth.route'));
router.use(baseApi, require('./user/user.route'));
router.use(baseApi, require('./course/course.route'));
router.use(baseApi, require('./topic/topic.route'));
router.use(baseApi, require('./question/question.route'));
router.use(baseApi, require('./quiz/quiz.route'));
router.use(baseApi, require('./result/result.route'));
router.use(baseApi, require('./role/role.route'));
router.use(baseApi, require('./privilege/privilege.route'));

module.exports = router;
