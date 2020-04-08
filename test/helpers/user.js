const AuthService = require('../../src/services/auth');
const RoleService = require('../../src/services/role');
const UserService = require('../../src/services/user');
const Roles = require('../../src/enums/roles');

const createUserAndSignIn = async (userDetails) => {
  const exists = await UserService.findOne({ email: userDetails.email });
  if (exists) { return; }

  try {
    const user = await AuthService.register(userDetails);
    const idToken = await AuthService.login(userDetails);
    return { user, idToken };
  } catch (e) {
    console.log(e);
  }
};

const createAdminAndSignIn = async (userDetails) => {
  const exists = await UserService.findOne({ email: userDetails.email });
  if (exists) { return; }

  try {
    const role = await RoleService.findOne({ name: Roles.ADMINISTRATOR });
    userDetails.roleId = role.id;

    const user = await AuthService.register(userDetails);
    const idToken = await AuthService.login(userDetails);
    return { user, idToken };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createUserAndSignIn,
  createAdminAndSignIn
};
