const router = require('express').Router();

const baseApi = '/api/v1';

// Perform the final set up of routes here
router.use('/', require('./ping'));
router.use(baseApi, require('./docs'));
router.use(baseApi, require('./auth'));
router.use(baseApi, require('./users'));
router.use(baseApi, require('./courses'));
router.use(baseApi, require('./topics'));
router.use(baseApi, require('./questions'));
router.use(baseApi, require('./quizzes'));
router.use(baseApi, require('./quiz-results'));
router.use(baseApi, require('./roles'));
router.use(baseApi, require('./privileges'));
module.exports = router;
