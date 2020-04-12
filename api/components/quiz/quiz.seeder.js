const QuizService = require('./quiz.service');
const QuestionService = require('../question/question.service');
const TopicService = require('../topic/topic.service');
const RoleService = require('../role/role.service');
const UserService = require('../user/user.service');
const { Roles } = require('../../enums');
const faker = require('faker');

function makeRandomQuiz () {
  /** @type {Quiz} */
  const quiz = {};
  // quiz.createdBy
  quiz.description = faker.lorem.sentence(25, 20);
  quiz.name = faker.lorem.sentence(3, 2);
  quiz.questionCount = Math.floor(Math.random() * 30) + 1;
  // quiz.questionIdList
  quiz.timeAllowed = Math.floor(Math.random() * 60) * 1000;
  // quiz.topicIdList

  return quiz;
}

/**
 *  Seed an ADMIN quiz
 *  @returns {Promise<void>}
 */
async function runDefault () {
}

runDefault.generateOne = async () => {
  const adminRole = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
  const admins = await UserService.find({ roleId: adminRole.id });
  const creator = faker.helpers.randomize(admins);

  let topicIds = await TopicService.find({});
  topicIds = topicIds.map(t => t.id);
  topicIds = faker.helpers.shuffle(topicIds)
    .slice(0, Math.floor(Math.random() * topicIds.length) + 1);

  let questionIds = await QuestionService.find({});
  questionIds = questionIds.map(t => t.id);
  questionIds = faker.helpers.shuffle(questionIds)
    .slice(0, Math.floor(Math.random() * questionIds.length) + 1);

  /** @type {Quiz} */
  const quiz = await makeRandomQuiz();
  quiz.createdBy = creator.id;
  quiz.topicIdList = topicIds;
  quiz.questionIdList = questionIds;

  return quiz;
};

runDefault.generateOneAndSave = async () => {
  const quizzes = await runDefault.generateOne();
  /** @type {Quiz} */
  const savedQuiz = await QuizService.create(quizzes);
  return savedQuiz;
};

runDefault.generate = async (count = 1) => {
  /** @type {Quiz[]} */
  const quizzes = new Array(count).fill({})
    .map(() => makeRandomQuiz());
  return quizzes;
};

runDefault.generateAndSave = async (count = 1) => {
  const quizzes = await runDefault.generate(count);
  const promises = quizzes.map(q => QuizService.create(q));
  /** @type {Quiz[]} */
  const savedQuizzes = await Promise.allSettled(promises);
  return savedQuizzes;
};

/** @typedef {import('../models/quiz').Quiz} Quiz */

module.exports = runDefault;
