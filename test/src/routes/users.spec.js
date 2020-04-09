const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const mongoHelper = require('../../helpers/mongoose');
const createApplication = require('../../../src/app');
const app = createApplication();
const seeders = require('../../../src/seeders');
const FirebaseDb = require('../../bootstrap/firebase-db');
const userHelper = require('../../helpers/user');
const bootstrap = require('../../bootstrap');

let users = {
  admin: { user: null, idToken: null },
  defaultUser: { user: null, idToken: null },
  anotherUser: { user: null, idToken: null }
};
const testAdmin = {
  displayName: 'SysAdmin',
  email: 'sysadmin@mcq.com',
  password: 'Admin123@'
};
const testUser = {
  displayName: 'Default User',
  email: 'defaultuser@mcq.com',
  password: 'defaultuser'
};
const testOther = {
  displayName: 'Another User',
  email: 'anotheruser@mcq.com',
  password: 'anotheruser'
};
let tempUser = {};

describe('Users Endpoint Test', () => {
  before(async () => {
    await bootstrap();
    await mongoHelper.clearDb();
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
  });

  beforeEach(async () => {
    await mongoHelper.clearDb();
    FirebaseDb.clearDb();
    await seeders.role();

    try {
      const admin = await userHelper.createAdminAndSignIn(testAdmin);
      const defaultUser = await userHelper.createUserAndSignIn(testUser);
      const anotherUser = await userHelper.createUserAndSignIn(testOther);
      users = { admin, defaultUser, anotherUser };
    } catch (e) {
      console.log(e);
      throw e;
    }
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
        .set('Authorization', users.defaultUser.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('PUT /api/v1/users/me', () => {
    it('should modify the requester\'s user details and return a status code of 200', async () => {
      tempUser = { displayName: 'johndoe' };
      const res = await chai.request(app).put('/api/v1/users/me')
        .set('Authorization', users.anotherUser.idToken).send({ user: tempUser });
      // some properties should not change
      expect(res.body.data._id).to.equal(users.anotherUser.user._id.toString());
      expect(res.body.data.email).to.equal(users.anotherUser.user.email);
      expect(res.body.data.password).to.equal(users.anotherUser.user.password);
      expect(res.body.data.phoneNumber).to.equal(users.anotherUser.user.phoneNumber);
      // the remaining properties can change
      expect(res.body.data.displayName).to.equal(tempUser.displayName);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should fetch user details by id if they exist', async () => {
      const res = await chai.request(app).get(`/api/v1/users/${users.defaultUser.user.id}`);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return 404 if there\'s no user with the given id', async () => {
      const res = await chai.request(app).get('/api/v1/users/2pz');
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      tempUser = { displayName: 'johndoe' };
      const res = await chai.request(app).put(`/api/v1/users/${users.anotherUser.user.id}`)
        .set('Authorization', users.defaultUser.idToken).send({ user: tempUser });
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 if there\'s no user with the given id', async () => {
      tempUser = { displayName: 'johndoe' };
      const res = await chai.request(app).put('/api/v1/users/2pz')
        .set('Authorization', users.admin.idToken).send({ user: tempUser });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });

    it('should update user information', async () => {
      tempUser = { displayName: 'johndoe' };
      const res = await chai.request(app).put(`/api/v1/users/${users.defaultUser.user.id}`)
        .set('Authorization', users.admin.idToken).send({ user: tempUser });
        // some properties should not change
      expect(res.body.data._id).to.equal(users.defaultUser.user._id.toString());
      expect(res.body.data.email).to.equal(users.defaultUser.user.email);
      expect(res.body.data.password).to.equal(users.defaultUser.user.password);
      expect(res.body.data.phoneNumber).to.equal(users.defaultUser.user.phoneNumber);
      // the remaining properties can change
      expect(res.body.data.displayName).to.equal(tempUser.displayName);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('DELETE /api/v1/users/me', () => {
    it('should return a status code of 204', async () => {
      const res = await chai.request(app).delete('/api/v1/users/me')
        .set('Authorization', users.anotherUser.idToken);
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/users/${users.anotherUser.user.id}`)
        .set('Authorization', users.defaultUser.idToken);
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status of 204, if the requester is an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/users/${users.defaultUser.user.id}`)
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });
});
