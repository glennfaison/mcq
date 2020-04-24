const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
const faker = require('faker');

const createApplication = require('../../app');
const FirebaseDb = require('../../mocks/firebase-db.service');
const { initializeTest, mongodbHelper, userHelper } = require('../../helpers');
const seedRoles = require('../role/role.seeder');
const seedUsers = require('../user/user.seeder');

const { expect } = chai;
chai.use(chaiHttp);
const app = createApplication();

let users = {
  admin: { user: null, idToken: null },
  defaultUser1: { user: null, idToken: null },
  defaultUser2: { user: null, idToken: null }
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
let testUser2 = {
  displayName: 'Another User',
  email: 'anotheruser@mcq.com',
  password: 'anotheruser'
};
let tempUser = {};

describe('Users Endpoint Test', () => {
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
    [testAdmin, testUser1, testUser2] = await seedUsers.generate(3);

    const admin = await userHelper.createAdminAndSignIn(testAdmin);
    const defaultUser1 = await userHelper.createUserAndSignIn(testUser1);
    const defaultUser2 = await userHelper.createUserAndSignIn(testUser2);
    users = { admin, defaultUser1, defaultUser2 };
  });

  describe('POST /api/v1/users', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/users');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should fetch all users and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users');
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('array');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should fetch the requester\'s user details', async () => {
      const res = await chai.request(app).get('/api/v1/users/me')
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('PUT /api/v1/users/me', () => {
    it('should modify the requester\'s user details and return a status code of 200', async () => {
      tempUser = { displayName: faker.internet.userName() };
      const res = await chai.request(app).put('/api/v1/users/me')
        .set('Authorization', users.defaultUser2.idToken).send({ user: tempUser });
      // some properties should not change
      expect(res.body.data._id).to.equal(users.defaultUser2.user._id.toString());
      expect(res.body.data.email).to.equal(users.defaultUser2.user.email);
      expect(res.body.data.password).to.equal(users.defaultUser2.user.password);
      expect(res.body.data.phoneNumber).to.equal(users.defaultUser2.user.phoneNumber);
      // the remaining properties can change
      expect(res.body.data.displayName).to.equal(tempUser.displayName);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should fetch user details by id if they exist', async () => {
      const res = await chai.request(app).get(`/api/v1/users/${users.defaultUser1.user.id}`);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return 404 if there\'s no user with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).get(`/api/v1/users/${fakeId}`);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      tempUser = { displayName: faker.internet.userName() };
      const res = await chai.request(app).put(`/api/v1/users/${users.defaultUser2.user.id}`)
        .set('Authorization', users.defaultUser1.idToken).send({ user: tempUser });
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 if there\'s no user with the given id', async () => {
      tempUser = { displayName: faker.internet.userName() };
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).put(`/api/v1/users/${fakeId}`)
        .set('Authorization', users.admin.idToken).send({ user: tempUser });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });

    it('should update user information', async () => {
      tempUser = { displayName: faker.internet.userName() };
      const res = await chai.request(app).put(`/api/v1/users/${users.defaultUser1.user.id}`)
        .set('Authorization', users.admin.idToken).send({ user: tempUser });
        // some properties should not change
      expect(res.body.data._id).to.equal(users.defaultUser1.user._id.toString());
      expect(res.body.data.email).to.equal(users.defaultUser1.user.email);
      expect(res.body.data.password).to.equal(users.defaultUser1.user.password);
      expect(res.body.data.phoneNumber).to.equal(users.defaultUser1.user.phoneNumber);
      // the remaining properties can change
      expect(res.body.data.displayName).to.equal(tempUser.displayName);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('DELETE /api/v1/users/me', () => {
    it('should return a status code of 204', async () => {
      const res = await chai.request(app).delete('/api/v1/users/me')
        .set('Authorization', users.defaultUser2.idToken);
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/users/${users.defaultUser2.user.id}`)
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status of 204, if the requester is an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/users/${users.defaultUser1.user.id}`)
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });
});
