const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

require('dotenv').config();
const bootstrap = require('../../bootstrap');

/** @type {import('express').Express|import('http').Server} */
let app;
let mongoHelper;

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

    mongoHelper = require('../../../helpers/mongoose');
    await mongoHelper.clearDb();

    const createApplication = require('../../../src/app');
    app = createApplication();
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
    // const firebase = require('@firebase/testing');
    // Promise.all(firebase.apps().map(app => app.delete()));
  });

  beforeEach(async () => {
    const seeders = require('../../../src/seeders');
    const userHelper = require('../../../helpers/user');

    await mongoHelper.clearDb();

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

  describe('GET api/v1/users', () => {
    it('should fetch all users and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users')
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.have.length.greaterThan(0);
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET api/v1/users/me', () => {
    it('should fetch the requester\'s user details', async () => {
      const res = await chai.request(app).get('/api/v1/users/me')
        .set('Authorization', users.defaultUser.idToken);
      expect(res.error).to.be.false;
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  /* describe('PUT api/v1/users/me', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('/api/v1/users/me');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('DELETE api/v1/users/me', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('api/v1/users/me');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET api/v1/users', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/users');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET api/v1/users/:id', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/openapi.json');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT api/v1/users/:id', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/openapi.json');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE api/v1/users/:id', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/api/v1/openapi.json');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  }); */
});
