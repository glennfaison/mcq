const RoleModel = require('./role.model');
const GenericCrudService = require('../../helpers/generic-crud-service');

class RoleService extends GenericCrudService {
  constructor () {
    super(RoleModel);
  }
}

const service = new RoleService();

module.exports = service;
