const CourseService = require('../services/course');
const RoleService = require('../services/role');
const UserService = require('../services/user');
const Roles = require('../enums/roles');
const faker = require('faker');

function makeRandomCourse () {
  /** @type {Course} */
  const course = {};
  course.courseCode = faker.random.alphaNumeric(3) + (faker.random.number(899) + 100);
  course.description = faker.lorem.sentence(15, 10);
  course.name = faker.lorem.sentence(5, 4);
  return course;
}

/**
 *  Seed an ADMIN course
 *  @returns {Promise<void>}
 */
async function runDefault () {
  const course = {
    courseCode: 'MAT101',
    description: 'The science of numbers',
    name: 'Introduction to Mathematics'
  };

  const promises = [];

  const exists = await CourseService.findOne({ courseCode: course.courseCode });
  if (!exists) { promises.push(CourseService.create(course)); }

  await Promise.all(promises).catch(e => {});
}

runDefault.generateOne = async () => {
  const adminRole = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
  const admins = await UserService.find({ roleId: adminRole.id });
  const creator = admins[Math.floor(Math.random() * admins.length)];
  /** @type {Course} */
  const course = await makeRandomCourse();
  course.createdBy = creator.id;

  return course;
};

runDefault.generateOneAndSave = async () => {
  const courses = await runDefault.generateOne();
  /** @type {Course} */
  const savedCourse = await CourseService.create(courses);
  return savedCourse;
};

runDefault.generate = async (count = 1) => {
  /** @type {Course[]} */
  const courses = new Array(count).fill({})
    .map(() => makeRandomCourse());
  return courses;
};

runDefault.generateAndSave = async (count = 1) => {
  const courses = await runDefault.generate(count);
  const promises = courses.map(u => CourseService.create(u));
  /** @type {Course[]} */
  const savedCourses = await Promise.allSettled(promises);
  return savedCourses;
};

/** @typedef {import('../models/course').Course} Course */

module.exports = runDefault;
