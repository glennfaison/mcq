const PrivilegeModel = require('./privilege.model');
const GenericCrudService = require('../../helpers/generic-crud-service');

class PrivilegeService extends GenericCrudService {
  constructor () {
    super(PrivilegeModel);
  }
}

const service = new PrivilegeService();

module.exports = service;
