const HttpStatus = require('http-status-codes');
const firebaseAdmin = require('../services/firebase-admin');
const UserService = require('../services/user');

/**
 *  Middleware to allow access to a route only if the requester is logged in
 */
async function authGuard (req, res, next) {
  const authorization = req.headers.authorization || '';
  try {
    const auth = await firebaseAdmin.verifyIdToken(authorization, true);
    if (!auth) {
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
    req.auth = await UserService.findOne({ uid: auth.uid });
    return next();
  } catch (e) {
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
}

module.exports = authGuard;
