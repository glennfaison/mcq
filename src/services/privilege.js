const Privilege = require('../models/privilege');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let service = {};

service = mixin(Privilege, service);

module.exports = service;
