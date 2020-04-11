const { TopicModel } = require('../models');
const mixin = require('../../helpers/mixin');

class _TopicService {
  findOneAndUpdate (conditions, properties) {
    return TopicModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_TopicService & import('mongoose').Model} TopicService */

/** @type {TopicService} */
const service = mixin(TopicModel, new _TopicService());

module.exports = service;
