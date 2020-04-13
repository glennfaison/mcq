const TopicModel = require('./topic.model');
const GenericCrudService = require('../../helpers/generic-crud-service');

class TopicService extends GenericCrudService {
  constructor () {
    super(TopicModel);
  }
}

const service = new TopicService();

module.exports = service;
