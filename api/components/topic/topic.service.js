const TopicDAO = require('./topic.dao');
const GenericCrudService = require('../../helpers/generic-crud-service');

class TopicService extends GenericCrudService {
  constructor () {
    super(TopicDAO);
  }
}

const service = new TopicService();

module.exports = service;
