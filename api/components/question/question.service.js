const QuestionDAO = require('./question.dao');
const GenericCrudService = require('../../helpers/generic-crud-service');

class QuestionService extends GenericCrudService {
  constructor () {
    super(QuestionDAO);
  }
}

const service = new QuestionService();

module.exports = service;
