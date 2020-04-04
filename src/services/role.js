const Role = require('../models/role');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(Role, service);

module.exports = service;
