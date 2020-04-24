const PrivilegeDAO = require('./privilege.dao');
const GenericCrudService = require('../../helpers/generic-crud-service');

class PrivilegeService extends GenericCrudService {
  constructor () {
    super(PrivilegeDAO);
  }
}

const service = new PrivilegeService();

module.exports = service;
