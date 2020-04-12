const RoleModel = require('./role.model');
const mixin = require('../../helpers/mixin');

class Service {
  findOneAndUpdate (conditions, properties) {
    return RoleModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {Service & import('mongoose').Model} RoleService */

/** @type {RoleService} */
const service = mixin(RoleModel, new Service());

module.exports = service;
