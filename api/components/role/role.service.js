const RoleDAO = require('./role.dao');
const GenericCrudService = require('../../helpers/generic-crud-service');

class RoleService extends GenericCrudService {
  constructor () {
    super(RoleDAO);
  }
}

const service = new RoleService();

module.exports = service;
