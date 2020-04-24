const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const createApplication = require('../../app');
const app = createApplication();
const FirebaseDb = require('../../mocks/firebase-db.service');
const { initializeTest, mongodbHelper, userHelper } = require('../../helpers');
const seedRoles = require('../role/role.seeder');
const seedUsers = require('../user/user.seeder');
const seedCourses = require('../course/course.seeder');
const seedTopics = require('../topic/topic.seeder');
const seedQuestions = require('../question/question.seeder');
const seedQuizzes = require('../quiz/quiz.seeder');

let users = {
  admin: { user: null, idToken: null },
  defaultUser1: { user: null, idToken: null }
};
let testAdmin, testUser1, testResult, testQuiz;

describe('Results Endpoint Test', () => {
  before(async () => {
    await initializeTest();
  });

  after(async () => {
    FirebaseDb.clearDb();
    await mongodbHelper.clearDb();
    await mongodbHelper.closeConnection();
  });

  beforeEach(async () => {
    FirebaseDb.clearDb();
    await mongodbHelper.clearDb();

    await seedRoles();
    await seedUsers();
    await seedCourses.generateOneAndSave();
    await seedTopics.generateOneAndSave();
    await seedQuestions.generateOneAndSave();
    [testAdmin, testUser1] = await seedUsers.generate(2);

    const admin = await userHelper.createAdminAndSignIn(testAdmin);
    const defaultUser1 = await userHelper.createUserAndSignIn(testUser1);
    users = { admin, defaultUser1 };

    testQuiz = await seedQuizzes.generateOneAndSave();
  });

  describe('GET /api/v1/results', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      // const res = await chai.request(app).get('/api/v1/results')
      //   .set('Authorization', users.defaultUser1.idToken);
      // expect(res.error).to.be.an('error');
      // expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fetch all results and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/results')
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('array');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/results/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      // const res = await chai.request(app).get(`/api/v1/results/${testResult.id}`)
      //   .set('Authorization', users.defaultUser1.idToken);
      // expect(res.error).to.be.an('error');
      // expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fetch result details by id if they exist', async () => {
      // const res = await chai.request(app).get(`/api/v1/results/${testResult.id}`)
      //   .set('Authorization', users.admin.idToken);
      // expect(res.error).to.be.false;
      // expect(res.status).to.be.oneOf([HttpStatus.OK, HttpStatus.ACCEPTED]);
    });

    it('should return 404 if there\'s no result with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).get(`/api/v1/results/${fakeId}`)
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /api/v1/results/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      // const res = await chai.request(app).delete(`/api/v1/results/${testResult.id}`)
      //   .set('Authorization', users.defaultUser1.idToken);
      // expect(res.error).to.be.an('error');
      // expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status of 204, if the requester is an administrator', async () => {
      // const res = await chai.request(app).delete(`/api/v1/results/${testResult.id}`)
      //   .set('Authorization', users.admin.idToken);
      // expect(res.error).to.be.false;
      // expect(res.body).to.be.empty;
      // expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });

  describe('GET /api/v1/users/me/results', () => {
    it('should fail with a status 401, if the requester is not signed in', async () => {
      const res = await chai.request(app).get('/api/v1/users/me/results');
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fetch all results and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users/me/results')
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('array');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/quizzes/:id/result', () => {
    beforeEach(async () => {
      testQuiz = await seedQuizzes.generateOneAndSave();
    });

    it('should fail with a status 401 if the requester is not signed in', async () => {
      const res = await chai.request(app).get(`/api/v1/quizzes/${testQuiz.id}/result`);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status 202 if the date for result release has not passed', async () => {
      const QuizService = require('../quiz/quiz.service');
      // Set `expiresAt` to 1 million seconds after creation
      await QuizService.findByIdAndUpdate(testQuiz.id, { expiresAt: Date.now() + (10 ** 6) });
      const res = await chai.request(app).get(`/api/v1/quizzes/${testQuiz.id}/result`)
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.false;
      expect(res).to.have.status(HttpStatus.ACCEPTED);
    });

    it('should fetch the result, and return a status of 200', async () => {
      const res = await chai.request(app).get(`/api/v1/quizzes/${testQuiz.id}/result`)
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.false;
      // expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });
});
