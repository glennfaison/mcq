const Topic = require('../models/topic');
const mixin = require('../../helpers/mixin');

class _TopicService {}

/** @typedef {_TopicService & import('mongoose').Model} TopicService */

/** @type {TopicService} */
const service = mixin(Topic, new _TopicService());

module.exports = service;
