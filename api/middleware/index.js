const authGuard = require('./auth-guard');
const adminGuard = require('./admin-guard');

module.exports = {
  authGuard: authGuard,
  adminGuard: adminGuard
};
