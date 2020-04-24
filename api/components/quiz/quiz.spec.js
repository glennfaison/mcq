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
let testAdmin = {
  displayName: 'SysAdmin',
  email: 'sysadmin@mcq.com',
  password: 'Admin123@'
};
let testUser1 = {
  displayName: 'Default User',
  email: 'defaultuser@mcq.com',
  password: 'defaultuser'
};
let testQuiz;
let tempQuiz = {};
const tempSubmission = {};

describe('Quizzes Endpoint Test', () => {
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
    tempQuiz = await seedQuizzes.generateOne();
  });

  describe('POST ' + testURI``, () => {
    it('should fail with a status 401 if the requester is not signed in', async () => {
      const res = await chai.request(app).post(testURI``).send({ quiz: tempQuiz });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with a status 401 if the requester is not admin', async () => {
      const res = await chai.request(app).post(testURI``)
        .set('Authorization', users.defaultUser1.idToken).send({ quiz: tempQuiz });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with a status 401 if the `createdBy` field is not set', async () => {
      delete tempQuiz.createdBy;
      const res = await chai.request(app).post(testURI``)
        .set('Authorization', users.admin.idToken).send({ quiz: tempQuiz });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should create a quiz, and return a status of 201', async () => {
      const res = await chai.request(app).post(testURI``)
        .set('Authorization', users.admin.idToken).send({ quiz: tempQuiz });
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.CREATED);
    });
  });

  describe(`GET ${testURI``}`, () => {
    it('should fetch all quizzes and have a status of 200', async () => {
      const res = await chai.request(app).get(testURI``);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('array');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe(`GET ${testURI`:id`}`, () => {
    it('should fetch quiz details by id if they exist', async () => {
      const res = await chai.request(app).get(testURI`${testQuiz.id}`);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return 404 if there\'s no quiz with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).get(testURI`${fakeId}`);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe(`PUT ${testURI`:id`}`, () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).put(testURI`${testQuiz.id}`)
        .set('Authorization', users.defaultUser1.idToken).send({ quiz: tempQuiz });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 if there\'s no quiz with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).put(testURI`${fakeId}`)
        .set('Authorization', users.admin.idToken).send({ quiz: tempQuiz });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });

    it('should update quiz information', async () => {
      const res = await chai.request(app).put(testURI`${testQuiz.id}`)
        .set('Authorization', users.admin.idToken).send({ quiz: tempQuiz });
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe(`DELETE ${testURI`:id`}`, () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).delete(testURI`${testQuiz.id}`)
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status of 204, if the requester is an administrator', async () => {
      const res = await chai.request(app).delete(testURI`${testQuiz.id}`)
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });

  describe('POST /api/v1/quizzes/:id/submit', () => {
    it('should fail with a status 401 if the requester is not signed in', async () => {
      const res = await chai.request(app).post(`/api/v1/quizzes/${testQuiz.id}/submit`)
        .send({ submission: tempSubmission });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should make the submission, and return a status of 202', async () => {
      const res = await chai.request(app).post(`/api/v1/quizzes/${testQuiz.id}/submit`)
        .set('Authorization', users.defaultUser1.idToken).send({ submission: tempSubmission });
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.ACCEPTED);
    });

    it('should fail with a status 400 if the submission exists already', async () => {
      await chai.request(app).post(`/api/v1/quizzes/${testQuiz.id}/submit`)
        .set('Authorization', users.defaultUser1.idToken).send({ submission: tempSubmission });
      const res = await chai.request(app).post(`/api/v1/quizzes/${testQuiz.id}/submit`)
        .set('Authorization', users.defaultUser1.idToken).send({ submission: tempSubmission });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/v1/quizzes/:id/result', () => {
    it('should fail with a status 401 if the requester is not signed in', async () => {
      const res = await chai.request(app).get(`/api/v1/quizzes/${testQuiz.id}/result`);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status 202 if the date for result release has not passed', async () => {
      const QuizService = require('./quiz.service');
      // Set `expiresAt` to 1 million seconds after creation
      await QuizService.findByIdAndUpdate(testQuiz.id, { expiresAt: Date.now() + 10 ** 6 });
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

function testURI (paths, id) {
  let res = '/api/v1/quizzes';
  if (id) { res += `/${id}`; }
  return res;
}
