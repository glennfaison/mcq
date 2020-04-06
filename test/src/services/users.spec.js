const { describe, it, before, after } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

require('dotenv').config();
const bootstrap = require('../../bootstrap');

/** @type {import('../../../src/services/user')} */
let UserService;
let mongoHelper;

/** @type {import('mongoose').Document & {email:string,password:string,displayName:string}} */
let testUser = {
  email: 'test.test@test.com',
  password: 'test.test',
  displayName: 'test.test'
};

describe('User service', function () {
  this.timeout(20000);

  before(async () => {
    await bootstrap();
    mongoHelper = require('../../../helpers/mongoose');
    await mongoHelper.clearDb();
    UserService = require('../../../src/services/user');
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
    // const firebase = require('@firebase/testing');
    // Promise.all(firebase.apps().map(app => app.delete()));
  });

  it('should find all users', async () => {
    const users = await UserService.find({});
    expect(users).to.have.lengthOf(0);
  });

  it('should create new user', async () => {
    const user = await UserService.create(testUser);
    expect(user.email).to.equal(testUser.email);
    const users = await UserService.find({});
    expect(users).to.have.lengthOf(1);
    expect(users[0].email).to.equal(testUser.email);
    testUser = user;
  });

  it('should modify the existing user', async () => {
    const displayName = 'John Doe';
    const updatedUser = await UserService.findOneAndUpdate({ _id: testUser._id }, { displayName });
    expect(updatedUser.displayName).to.equal(displayName);
  });

  it('should remove user', async () => {
    await UserService.findOneAndDelete({ _id: testUser._id });
    const users = await UserService.find({});
    expect(users).to.have.lengthOf(0);
  });
});
