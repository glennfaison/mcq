
const TopicService = require('./topic.service');
const CourseService = require('../course/course.service');
const RoleService = require('../role/role.service');
const UserService = require('../user/user.service');
const { Roles } = require('../../enums');
const faker = require('faker');

function makeRandomTopic () {
  /** @type {Topic} */
  const topic = {};
  topic.description = faker.lorem.sentence(15, 10);
  topic.name = faker.lorem.sentence(5, 4);
  return topic;
}

/**
 *  Seed an ADMIN topic
 *  @returns {Promise<void>}
 */
async function runDefault () {
  const topic = {
    courseId: 'MAT101',
    name: 'Introduction to Algebra',
    description: 'The basics of algebra',
    createdBy: ''
  };

  const promises = [];

  const exists = await TopicService.findOne({ courseId: topic.courseId, name: topic.name });
  if (!exists) { promises.push(TopicService.create(topic)); }

  await Promise.all(promises).catch(e => {});
}

runDefault.generateOne = async () => {
  const adminRole = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
  const admins = await UserService.find({ roleId: adminRole.id });
  const creator = admins[Math.floor(Math.random() * admins.length)];

  const courses = await CourseService.find({});
  const course = courses[Math.floor(Math.random() * courses.length)];

  /** @type {Topic} */
  const topic = await makeRandomTopic();
  topic.createdBy = creator.id;
  topic.courseId = course.id;

  return topic;
};

runDefault.generateOneAndSave = async () => {
  const topics = await runDefault.generateOne();
  /** @type {Topic} */
  const savedTopic = await TopicService.create(topics);
  return savedTopic;
};

runDefault.generate = async (count = 1) => {
  /** @type {Topic[]} */
  const topics = new Array(count).fill({})
    .map(() => makeRandomTopic());
  return topics;
};

runDefault.generateAndSave = async (count = 1) => {
  const topics = await runDefault.generate(count);
  const promises = topics.map(u => TopicService.create(u));
  /** @type {Topic[]} */
  const savedTopics = await Promise.allSettled(promises);
  return savedTopics;
};

/** @typedef {import('../models/topic').Topic} Topic */

module.exports = runDefault;
