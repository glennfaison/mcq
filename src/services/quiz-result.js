const QuizResult = require('../models/quiz-result');
const mixin = require('../../helpers/mixin');

class _QuizResultService {}

/** @typedef {_QuizResultService & import('mongoose').Model} QuizResultService */

/** @type {QuizResultService} */
const service = mixin(QuizResult, new _QuizResultService());

module.exports = service;
