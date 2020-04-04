const Course = require('../models/Course');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(Course, service);

module.exports = service;
