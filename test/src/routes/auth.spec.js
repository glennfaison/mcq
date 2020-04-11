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
const faker = require('faker');

let users = {
  admin: { user: null, idToken: null, password: null },
  defaultUser1: { user: null, idToken: null, password: null },
  defaultUser2: { user: null, idToken: null, password: null }
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

describe('Auth Endpoint Test', () => {
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
    [testAdmin, testUser1, testUser2] = await seeders.users.generate(3);

    const admin = await userHelper.createAdminAndSignIn(testAdmin);
    const defaultUser1 = await userHelper.createUserAndSignIn(testUser1);
    const defaultUser2 = await userHelper.createUserAndSignIn(testUser2);
    users = { admin, defaultUser1, defaultUser2 };
  });

  describe('POST /api/v1/auth/register', () => {
    it('should fail to register without the \'email\' field', async () => {
      const user = await seeders.users.generateOne();
      delete user.email;
      const res = await chai.request(app).post('/api/v1/auth/register')
        .send({ user });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail to register without the \'password\' field', async () => {
      const user = await seeders.users.generateOne();
      delete user.password;
      const res = await chai.request(app).post('/api/v1/auth/register')
        .send({ user });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should register a user', async () => {
      const user = await seeders.users.generateOne();
      const res = await chai.request(app).post('/api/v1/auth/register')
        .send({ user });
      expect(res.error).to.be.false;
      expect(res.body.data).to.have.property('email');
      expect(res.body.data.email).to.equal(user.email);
      expect(res).to.have.status(HttpStatus.CREATED);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should fail to sign a user in without the \'email\' field', async () => {
      const user = users.defaultUser1.user.toJSON();
      delete user.email;
      user.password = users.defaultUser1.password;
      const res = await chai.request(app).post('/api/v1/auth/login')
        .send({ user });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail to sign a user in without the \'password\' field', async () => {
      const user = await users.defaultUser1.user;
      // `users.defaultUser1.user` has no password field
      const res = await chai.request(app).post('/api/v1/auth/login')
        .send({ user });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail to sign a user in with an \'email\' field that doesn\'t exist in the database', async () => {
      const user = users.defaultUser1.user;
      user.password = users.defaultUser1.password;
      user.email = faker.internet.email();
      const res = await chai.request(app).post('/api/v1/auth/login')
        .send({ user });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail to sign a user in with the wrong \'password\' field', async () => {
      const user = users.defaultUser1.user;
      user.password = faker.internet.password();
      const res = await chai.request(app).post('/api/v1/auth/login')
        .send({ user });
      expect(res.error).to.be.an('error');
      expect(res).to.have.status(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should sign a user in', async () => {
      const user = users.defaultUser1.user.toJSON();
      user.password = users.defaultUser1.password;
      const res = await chai.request(app).post('/api/v1/auth/login')
        .send({ user });
      expect(res.error).to.be.false;
      expect(res.body.data).to.be.a('string');
      expect(res).to.have.status(HttpStatus.OK);
    });
  });
});
