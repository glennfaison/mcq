const QuizResult = require('../models/quiz-result');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(QuizResult, service);

module.exports = service;
