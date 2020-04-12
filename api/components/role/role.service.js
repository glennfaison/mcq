const RoleModel = require('./role.model');
const mixin = require('../../helpers/mixin');

class _RoleService {
  findOneAndUpdate (conditions, properties) {
    return RoleModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_RoleService & import('mongoose').Model} RoleService */

/** @type {RoleService} */
const service = mixin(RoleModel, new _RoleService());

module.exports = service;
