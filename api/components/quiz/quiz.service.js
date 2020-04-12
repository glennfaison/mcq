const QuizModel = require('./quiz.model');
const mixin = require('../../helpers/mixin');

class _QuizService {
  findOneAndUpdate (conditions, properties) {
    return QuizModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_QuizService & import('mongoose').Model} QuizService */

/** @type {QuizService} */
const service = mixin(QuizModel, new _QuizService());

module.exports = service;
