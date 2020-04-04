const Topic = require('../models/topic');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(Topic, service);

module.exports = service;
