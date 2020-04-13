const QuizModel = require('./quiz.model');
const GenericCrudService = require('../../helpers/generic-crud-service');

class QuizService extends GenericCrudService {
  constructor () {
    super(QuizModel);
  }
}

const service = new QuizService();

module.exports = service;
