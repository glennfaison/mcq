const Quiz = require('../models/quiz');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(Quiz, service);

module.exports = service;
