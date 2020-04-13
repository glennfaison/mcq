const CourseModel = require('./course.model');
const GenericCrudService = require('../../helpers/generic-crud-service');

class CourseService extends GenericCrudService {
  constructor () {
    super(CourseModel);
  }
}

const service = new CourseService();

module.exports = service;
