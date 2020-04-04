const HttpStatus = require('http-status-codes');
const RoleService = require('../services/role');

/**
 *  Middleware to allow access to a route only if the requester is an ADMIN
 */
async function adminGuard (req, res, next) {
  try {
    if (!req.auth) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    const role = await RoleService.findById(req.auth.id);
    if (!role || role.name !== 'ADMIN') {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    return next();
  } catch (e) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
}

module.exports = adminGuard;
