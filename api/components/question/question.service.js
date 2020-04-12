const QuestionModel = require('./question.model');
const mixin = require('../../helpers/mixin');

class _QuestionService {
  findOneAndUpdate (conditions, properties) {
    return QuestionModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_QuestionService & import('mongoose').Model} QuestionService */

/** @type {QuestionService} */
const service = mixin(QuestionModel, new _QuestionService());

module.exports = service;
