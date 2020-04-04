const Question = require('../models/question');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(Question, service);

module.exports = service;
