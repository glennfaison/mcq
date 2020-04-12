const QuestionModel = require('./question.model');
const mixin = require('../../helpers/mixin');

class Service {
  findOneAndUpdate (conditions, properties) {
    return QuestionModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {Service & import('mongoose').Model} QuestionService */

/** @type {QuestionService} */
const service = mixin(QuestionModel, new Service());

module.exports = service;
