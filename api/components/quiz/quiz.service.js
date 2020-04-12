const QuizModel = require('./quiz.model');
const mixin = require('../../helpers/mixin');

class Service {
  findOneAndUpdate (conditions, properties) {
    return QuizModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {Service & import('mongoose').Model} QuizService */

/** @type {QuizService} */
const service = mixin(QuizModel, new Service());

module.exports = service;
