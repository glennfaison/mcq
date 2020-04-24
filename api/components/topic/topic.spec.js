const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');

const createApplication = require('../../app');
const FirebaseDb = require('../../mocks/firebase-db.service');
const { initializeTest, mongodbHelper, userHelper } = require('../../helpers');
const seedRoles = require('../role/role.seeder');
const seedUsers = require('../user/user.seeder');
const seedCourses = require('../course/course.seeder');
const seedTopics = require('../topic/topic.seeder');

const { expect } = chai;
chai.use(chaiHttp);
const app = createApplication();

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
let testTopic;
let tempTopic = {};

describe('Topics Endpoint Test', () => {
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
    [testAdmin, testUser1] = await seedUsers.generate(2);

    const admin = await userHelper.createAdminAndSignIn(testAdmin);
    const defaultUser1 = await userHelper.createUserAndSignIn(testUser1);
    users = { admin, defaultUser1 };

    testTopic = await seedTopics.generateOneAndSave();
    tempTopic = await seedTopics.generateOne();
  });

  describe('POST /api/v1/topics', () => {
    it('should fail with a status 401 if the requester is signed in', async () => {
      const res = await chai.request(app).post('/api/v1/topics').send({ topic: tempTopic });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with a status 401 if the requester is not admin', async () => {
      const res = await chai.request(app).post('/api/v1/topics')
        .set('Authorization', users.defaultUser1.idToken).send({ topic: tempTopic });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with a status 401 if the `createdBy` field is not set', async () => {
      delete tempTopic.createdBy;
      const res = await chai.request(app).post('/api/v1/topics')
        .set('Authorization', users.admin.idToken).send({ topic: tempTopic });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should create a topic, and return a status of 201', async () => {
      const res = await chai.request(app).post('/api/v1/topics')
        .set('Authorization', users.admin.idToken).send({ topic: tempTopic });
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.CREATED);
    });
  });

  describe('GET /api/v1/topics', () => {
    it('should fetch all topics and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/topics');
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('array');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/topics/:id', () => {
    it('should fetch topic details by id if they exist', async () => {
      const res = await chai.request(app).get(`/api/v1/topics/${testTopic.id}`);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return 404 if there\'s no topic with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).get(`/api/v1/topics/${fakeId}`);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/v1/topics/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).put(`/api/v1/topics/${testTopic.id}`)
        .set('Authorization', users.defaultUser1.idToken).send({ topic: tempTopic });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 if there\'s no topic with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).put(`/api/v1/topics/${fakeId}`)
        .set('Authorization', users.admin.idToken).send({ topic: tempTopic });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });

    it('should update topic information', async () => {
      const res = await chai.request(app).put(`/api/v1/topics/${testTopic.id}`)
        .set('Authorization', users.admin.idToken).send({ topic: tempTopic });
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('DELETE /api/v1/topics/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/topics/${testTopic.id}`)
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status of 204, if the requester is an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/topics/${testTopic.id}`)
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });
});
