const RoleService = require('../services/role');
const Roles = require('../enums/roles');

/**
 *  Seed two role types
 *  @returns {Promise<void>}
 */
async function run () {
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

module.exports = run;
