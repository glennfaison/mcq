const { QuestionService, RoleService, UserService, TopicService } = require('../services');
const { Roles } = require('../enums');
const faker = require('faker');

function generateOptions (count) {
  /** @type {string[]} */
  const options = new Array(count).fill('')
    .map(() => faker.lorem.sentence(15, 10));
  return options;
}

function makeRandomQuestion () {
  /** @type {Question} */
  const question = {};
  const optionCount = 5;
  question.optionList = generateOptions(optionCount);
  const correctIndexCount = Math.floor(Math.random() * (optionCount - 1)) + 1;
  let indices = new Array(optionCount).fill().map((v, i) => i);
  indices = faker.helpers.shuffle(indices);
  question.correctOptionIndices = indices.slice(0, correctIndexCount);
  question.text = faker.lorem.sentence(25, 20);
  // question.topicId
  // question.createdBy

  return question;
}

/**
 *  Seed an ADMIN question
 *  @returns {Promise<void>}
 */
async function runDefault () {
}

runDefault.generateOne = async () => {
  const adminRole = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
  const admins = await UserService.find({ roleId: adminRole.id });
  const creator = admins[Math.floor(Math.random() * admins.length)];

  const topics = await TopicService.find({});
  const topic = topics[Math.floor(Math.random() * topics.length)];

  /** @type {Question} */
  const question = await makeRandomQuestion();
  question.createdBy = creator.id;
  question.topicId = topic.id;

  return question;
};

runDefault.generateOneAndSave = async () => {
  const questions = await runDefault.generateOne();
  /** @type {Question} */
  const savedQuestion = await QuestionService.create(questions);
  return savedQuestion;
};

runDefault.generate = async (count = 1) => {
  /** @type {Question[]} */
  const questions = new Array(count).fill({})
    .map(() => makeRandomQuestion());
  return questions;
};

runDefault.generateAndSave = async (count = 1) => {
  const questions = await runDefault.generate(count);
  const promises = questions.map(u => QuestionService.create(u));
  /** @type {Question[]} */
  const savedQuestions = await Promise.allSettled(promises);
  return savedQuestions;
};

/** @typedef {import('../models/question').Question} Question */

module.exports = runDefault;
