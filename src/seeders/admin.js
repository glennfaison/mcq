const UserService = require('../services/user');
const RoleService = require('../services/role');
const Roles = require('../enums/roles');

/**
 *  Seed an ADMIN user
 *  @returns {Promise<void>}
 */
async function run () {
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

module.exports = run;
