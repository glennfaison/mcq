const Role = require('../models/role');
const mixin = require('../../helpers/mixin');

class _RoleService {
  findOneAndUpdate (conditions, properties) {
    return Role.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_RoleService & import('mongoose').Model} RoleService */

/** @type {RoleService} */
const service = mixin(Role, new _RoleService());

module.exports = service;
