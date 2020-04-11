const QuizResultModel = require('../models/quiz-result');
const mixin = require('../../helpers/mixin');

class _QuizResultService {
  findOneAndUpdate (conditions, properties) {
    return QuizResultModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_QuizResultService & import('mongoose').Model} QuizResultService */

/** @type {QuizResultService} */
const service = mixin(QuizResultModel, new _QuizResultService());

module.exports = service;
