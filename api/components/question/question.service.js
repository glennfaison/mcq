const QuestionModel = require('./question.model');
const GenericCrudService = require('../../helpers/generic-crud-service');

class QuestionService extends GenericCrudService {
  constructor () {
    super(QuestionModel);
  }
}

const service = new QuestionService();

module.exports = service;
