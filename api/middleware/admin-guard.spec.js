const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

const createApplication = require('../app');
const app = createApplication();
const FirebaseDb = require('../mocks/firebase-db.service');
const { initializeTest, mongodbHelper, userHelper } = require('../helpers');
const seedRoles = require('../components/role/role.seeder');
const adminGuard = require('./admin-guard');

const testUrl = '/api/v1/admin-only';
const testHandler = async (req, res, next) => {
  return res.status(HttpStatus.OK).end('Admin!');
};

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

describe('API test for privilege-based access', () => {
  before(async () => {
    await initializeTest();
    await mongodbHelper.clearDb();

    // Create test routes
    app.get(testUrl, (req, res, next) => { req.auth = users.admin.user; next(); }, adminGuard, testHandler);
    app.get(testUrl, (req, res, next) => { req.auth = users.defaultUser.user; next(); }, adminGuard, testHandler);
  });

  after(async () => {
    await mongodbHelper.clearDb();
    await mongodbHelper.closeConnection();

    // Delete test routes
    app.get(testUrl, (req, res, next) => next());
    app.get(testUrl, (req, res, next) => next());
  });

  beforeEach(async () => {
    await mongodbHelper.clearDb();
    FirebaseDb.clearDb();
    await seedRoles();

    try {
      const admin = await userHelper.createAdminAndSignIn(testAdmin);
      const defaultUser = await userHelper.createUserAndSignIn(testUser);
      users = { admin: admin || users.admin, defaultUser: defaultUser || users.defaultUser };
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  describe(`GET ${testUrl}`, () => {
    it('should return a status code of 200 for an admin user', async () => {
      try {
        const res = await chai.request(app).get(testUrl);
        expect(res.error).to.be.false;
        expect(res).to.have.status(HttpStatus.OK);
        expect(res.text).to.equal('Admin!');
      } catch (e) {}
    });

    it('should return a status code of 401 for a non-admin user', async () => {
      try {
        const res = await chai.request(app).get(testUrl);
        expect(res.error).to.be.an('error');
        expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
      } catch (e) {}
    });
  });
});
