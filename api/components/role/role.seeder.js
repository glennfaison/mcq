const RoleService = require('./role.service');
const { Roles } = require('../../enums');
const faker = require('faker');

function makeRandomRole () {
  /** @type {Role} */
  const role = {};
  role.description = faker.lorem.sentence(10, 5);
  role.name = faker.hacker.noun().toUpperCase();
  role.type = faker.hacker.noun().toUpperCase();
  return role;
}

/**
 *  Seed two role types
 *  @returns {Promise<void>}
 */
async function runDefault () {
  const adminRole = {
    name: Roles.ADMINISTRATOR,
    description: 'Administrator of the system',
    type: Roles.ADMINISTRATOR
  };
  const defaultRole = {
    name: Roles.DEFAULT,
    description: 'Default user of the system',
    type: Roles.DEFAULT
  };

  const adminRoleExists = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
  const defaultRoleExists = await RoleService.findOne({ name: Roles.DEFAULT });

  const promises = [];
  if (!adminRoleExists) { promises.push(RoleService.create(adminRole)); }
  if (!defaultRoleExists) { promises.push(RoleService.create(defaultRole)); }

  await Promise.all(promises).catch(e => {});
}

runDefault.generateOne = async () => {
  /** @type {Role} */
  const role = makeRandomRole();
  return role;
};

runDefault.generateOneAndSave = async () => {
  const role = await runDefault.generateOne();
  /** @type {Role} */
  const savedRole = await RoleService.create(role);
  return savedRole;
};

runDefault.generate = async (count = 1) => {
  /** @type {Role[]} */
  const roles = new Array(count).fill({})
    .map(() => makeRandomRole());
  return roles;
};

runDefault.generateAndSave = async (count = 1) => {
  const roles = await runDefault.generate(count);
  const promises = roles.map(u => RoleService.create(u));
  /** @type {Role[]} */
  const savedRoles = await Promise.allSettled(promises);
  return savedRoles;
};

/** @typedef {import('../models/role').Role} Role */

module.exports = runDefault;
