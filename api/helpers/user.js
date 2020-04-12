const AuthService = require('../components/auth/auth.service');
const RoleService = require('../components/role/role.service');
const UserService = require('../components/user/user.service');
const { Roles } = require('../enums');

const createUserAndSignIn = async (userDetails) => {
  const exists = await UserService.findOne({ email: userDetails.email });
  if (exists) { return; }

  try {
    const user = await AuthService.register(userDetails);
    const idToken = await AuthService.login(userDetails);
    return { user, idToken, password: userDetails.password };
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
    return { user, idToken, password: userDetails.password };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createUserAndSignIn,
  createAdminAndSignIn
};
