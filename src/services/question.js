const Question = require('../models/question');
const mixin = require('../../helpers/mixin');

class _QuestionService {}

/** @typedef {_QuestionService & import('mongoose').Model} QuestionService */

/** @type {QuestionService} */
const service = mixin(Question, new _QuestionService());

module.exports = service;
