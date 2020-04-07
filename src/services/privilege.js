const Privilege = require('../models/privilege');
const mixin = require('../../helpers/mixin');

class _PrivilegeService {}

/** @typedef {_PrivilegeService & import('mongoose').Model} PrivilegeService */

/** @type {PrivilegeService} */
const service = mixin(Privilege, new _PrivilegeService());

module.exports = service;
