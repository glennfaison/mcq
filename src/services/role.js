const Role = require('../models/role');
const mixin = require('../../helpers/mixin');

class _RoleService {}

/** @typedef {_RoleService & import('mongoose').Model} RoleService */

/** @type {RoleService} */
const service = mixin(Role, new _RoleService());

module.exports = service;
