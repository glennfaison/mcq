const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const createApplication = require('../../../src/app');
const app = createApplication();
const seeders = require('../../../src/seeders');
const bootstrap = require('../../bootstrap');
const FirebaseDb = require('../../bootstrap/firebase-db');
const userHelper = require('../../helpers/user');
const mongoHelper = require('../../helpers/mongoose');

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
let testRole;
let tempRole = {};

describe('Roles Endpoint Test', () => {
  before(async () => {
    await bootstrap();
  });

  after(async () => {
    FirebaseDb.clearDb();
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
  });

  beforeEach(async () => {
    FirebaseDb.clearDb();
    await mongoHelper.clearDb();

    await seeders.roles();
    [testAdmin, testUser1] = await seeders.users.generate(2);

    const admin = await userHelper.createAdminAndSignIn(testAdmin);
    const defaultUser1 = await userHelper.createUserAndSignIn(testUser1);
    users = { admin, defaultUser1 };

    testRole = await seeders.roles.generateOneAndSave();
    tempRole = await seeders.roles.generateOne();
  });

  describe('POST /api/v1/roles', () => {
    it('should fail with a status 401 if the requester is signed in', async () => {
      const res = await chai.request(app).post('/api/v1/roles').send({ role: tempRole });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with a status 401 if the requester is not admin', async () => {
      const res = await chai.request(app).post('/api/v1/roles')
        .set('Authorization', users.defaultUser1.idToken).send({ role: tempRole });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should create a role, and return a status of 201', async () => {
      const res = await chai.request(app).post('/api/v1/roles')
        .set('Authorization', users.admin.idToken).send({ role: tempRole });
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.CREATED);
    });
  });

  describe('GET /api/v1/roles', () => {
    it('should fetch all roles and have a status of 200', async () => {
      const res = await chai.request(app).get('/api/v1/roles');
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('array');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('GET /api/v1/roles/:id', () => {
    it('should fetch role details by id if they exist', async () => {
      const res = await chai.request(app).get(`/api/v1/roles/${testRole.id}`);
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.an('object');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return 404 if there\'s no role with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).get(`/api/v1/roles/${fakeId}`);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /api/v1/roles/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).put(`/api/v1/roles/${testRole.id}`)
        .set('Authorization', users.defaultUser1.idToken).send({ role: tempRole });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 if there\'s no role with the given id', async () => {
      const fakeId = FirebaseDb.makeId(24);
      const res = await chai.request(app).put(`/api/v1/roles/${fakeId}`)
        .set('Authorization', users.admin.idToken).send({ role: tempRole });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });

    it('should update role information', async () => {
      const res = await chai.request(app).put(`/api/v1/roles/${testRole.id}`)
        .set('Authorization', users.admin.idToken).send({ role: tempRole });
      expect(res.body.data).to.not.be.empty;
      expect(res).to.have.status(HttpStatus.OK);
    });
  });

  describe('DELETE /api/v1/roles/:id', () => {
    it('should fail with a status 401, if the requester is not an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/roles/${testRole.id}`)
        .set('Authorization', users.defaultUser1.idToken);
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
    });

    it('should return a status of 204, if the requester is an administrator', async () => {
      const res = await chai.request(app).delete(`/api/v1/roles/${testRole.id}`)
        .set('Authorization', users.admin.idToken);
      expect(res.error).to.be.false;
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NO_CONTENT);
    });
  });
});
