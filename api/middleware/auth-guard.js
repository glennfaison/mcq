const HttpStatus = require('http-status-codes');
const AuthService = require('../components/auth/auth.service');

/**
 *  Middleware to allow access to a route only if the requester is logged in
 */
async function authGuard (req, res, next) {
  const authorization = req.headers.authorization || '';
  try {
    const user = await AuthService.verifyIdToken(authorization, true);
    if (!user) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    req.auth = user;
    return next();
  } catch (e) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
}

module.exports = authGuard;
