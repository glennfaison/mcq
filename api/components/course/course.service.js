const CourseDAO = require('./course.dao');
const GenericCrudService = require('../../helpers/generic-crud-service');

class CourseService extends GenericCrudService {
  constructor () {
    super(CourseDAO);
  }
}

const service = new CourseService();

module.exports = service;
