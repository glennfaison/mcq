const UserService = require('../services/user');
const RoleService = require('../services/role');
const Roles = require('../enums/roles');
const faker = require('faker');

function makeRandomUser () {
  const user = {};
  user.gender = Math.floor(Math.random() * 2);
  user.firstName = faker.name.firstName(user.gender);
  user.lastName = faker.name.lastName(user.gender);
  user.displayName = faker.internet.userName(user.firstName, user.lastName);
  user.email = faker.internet.email(user.firstName, user.lastName);
  user.password = faker.internet.password();
  user.phoneNumber = faker.phone.phoneNumber();
  user.photoURL = faker.internet.avatar();
  return user;
}

/**
 *  Seed an ADMIN user
 *  @returns {Promise<void>}
 */
async function runDefault () {
  const role = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
  const admin = {
    displayName: 'Administrator',
    email: 'administrator@mcq.com',
    password: 'Admin123@',
    roleId: role.id
  };

  const promises = [];

  const adminExists = await UserService.findOne({ email: admin.email });
  if (!adminExists) { promises.push(UserService.create(admin)); }

  await Promise.all(promises).catch(e => {});
}

runDefault.generateOne = async () => {
  const defaultRole = await RoleService.findOne({ name: Roles.DEFAULT });
  /** @type {User} */
  const user = makeRandomUser();
  user.roleId = defaultRole || defaultRole.id;

  return user;
};

runDefault.generateOneAndSave = async () => {
  const users = await runDefault.generateOne();
  /** @type {User} */
  const savedUser = await UserService.create(users);
  return savedUser;
};

runDefault.generate = async (count = 1) => {
  const defaultRole = await RoleService.findOne({ name: Roles.DEFAULT });
  /** @type {User[]} */
  const users = new Array(count).fill({})
    .map(() => makeRandomUser())
    .map(u => ({ ...u, roleId: defaultRole.id }));
  return users;
};

runDefault.generateAndSave = async (count = 1) => {
  const users = await runDefault.generate(count);
  const promises = users.map(u => UserService.create(u));
  /** @type {User[]} */
  const savedUsers = await Promise.allSettled(promises);
  return savedUsers;
};

/** @typedef {import('../models/user').User} User */

module.exports = runDefault;
