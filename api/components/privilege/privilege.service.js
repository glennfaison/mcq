const PrivilegeModel = require('./privilege.model');
const mixin = require('../../helpers/mixin');

class Service {
  findOneAndUpdate (conditions, properties) {
    return PrivilegeModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {Service & import('mongoose').Model} PrivilegeService */

/** @type {PrivilegeService} */
const service = mixin(PrivilegeModel, new Service());

module.exports = service;
