const PrivilegeModel = require('./privilege.model');
const mixin = require('../../helpers/mixin');

class _PrivilegeService {
  findOneAndUpdate (conditions, properties) {
    return PrivilegeModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }
}

/** @typedef {_PrivilegeService & import('mongoose').Model} PrivilegeService */

/** @type {PrivilegeService} */
const service = mixin(PrivilegeModel, new _PrivilegeService());

module.exports = service;
