const QuizDAO = require('./quiz.dao');
const GenericCrudService = require('../../helpers/generic-crud-service');

class QuizService extends GenericCrudService {
  constructor () {
    super(QuizDAO);
  }
}

const service = new QuizService();

module.exports = service;
