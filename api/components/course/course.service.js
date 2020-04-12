const CourseModel = require('./course.model');
const mixin = require('../../helpers/mixin');

class _CourseService {
  findOneAndUpdate (conditions, properties) {
    return CourseModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_CourseService & import('mongoose').Model} CourseService */

/** @type {CourseService} */
const service = mixin(CourseModel, new _CourseService());

module.exports = service;
