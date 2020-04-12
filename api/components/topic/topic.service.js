const TopicModel = require('./topic.model');
const mixin = require('../../helpers/mixin');

class Service {
  findOneAndUpdate (conditions, properties) {
    return TopicModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {Service & import('mongoose').Model} TopicService */

/** @type {TopicService} */
const service = mixin(TopicModel, new Service());

module.exports = service;
