const Quiz = require('../models/quiz');
const mixin = require('../../helpers/mixin');

class _QuizService {}

/** @typedef {_QuizService & import('mongoose').Model} QuizService */

/** @type {QuizService} */
const service = mixin(Quiz, new _QuizService());

module.exports = service;
