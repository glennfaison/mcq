const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const faker = require('faker');
const seeders = require('../../../src/seeders');
const bootstrap = require('../../bootstrap');
const mongoHelper = require('../../helpers/mongoose');
const UserService = require('../../../src/services/user');
const FirebaseDb = require('../../bootstrap/firebase-db');

/** @type {import('../../../src/models/user').User} */
let testUser;

describe('User service', () => {
  before(async () => {
    await bootstrap();
  });

  after(async () => {
    await mongoHelper.clearDb();
    FirebaseDb.clearDb();
    await mongoHelper.closeConnection();
  });

  beforeEach(async () => {
    await mongoHelper.clearDb();
    FirebaseDb.clearDb();
    await seeders.role();
    testUser = (await seeders.users.generate(1))[0];
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
  });

  it('should modify the existing user', async () => {
    testUser = await UserService.create(testUser);
    const displayName = faker.internet.userName();
    const updatedUser = await UserService.findOneAndUpdate({ _id: testUser._id }, { displayName });
    expect(updatedUser.displayName).to.equal(displayName);
  });

  it('should remove user', async () => {
    testUser = await UserService.create(testUser);
    let users = await UserService.find({});
    expect(users).to.have.lengthOf(1);
    await UserService.findOneAndDelete({ _id: testUser._id });
    users = await UserService.find({});
    expect(users).to.have.lengthOf(0);
  });
});
