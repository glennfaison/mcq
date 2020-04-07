const Course = require('../models/course');
const mixin = require('../../helpers/mixin');

class _CourseService {}

/** @typedef {_CourseService & import('mongoose').Model} CourseService */

/** @type {CourseService} */
const service = mixin(Course, new _CourseService());

module.exports = service;
