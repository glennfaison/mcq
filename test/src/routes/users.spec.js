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
  defaultUser: { user: null, idToken: null }
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
      users = { admin: admin || users.admin, defaultUser: defaultUser || users.defaultUser };
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  describe('GET /api/v1/users', () => {
    it('should fetch all users and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users')
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.have.length.greaterThan(0);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should fetch the requester\'s user details', async () => {
      const res = await chai.request(app).get('/api/v1/users/me')
        .set('Authorization', users.defaultUser.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user information', async () => {
      const user = { displayName: 'johndoe' };
      const res = await chai.request(app).put(`/api/v1/users/${users.defaultUser.user.id}`)
        .set('Authorization', users.admin.idToken).send({ user });
      expect(res.body.data.displayName).to.equal(user.displayName);
      // that the others have not changed
      expect(res.body.data.phoneNumber).eq(users.defaultUser.user.phoneNumber);
    });
  });

  /* describe('PUT /api/v1/users/me', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users/me');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('DELETE /api/v1/users/me', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('api/v1/users/me');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/users');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/openapi.json');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/openapi.json');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  }); */
});
