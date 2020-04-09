const UserService = require('./user');
let _firebaseAdmin = require('./firebase-admin');
let _firebaseClient = require('./firebase-client');

class AuthService {
  constructor () {
    if (AuthService.instance) { return AuthService.instance; }
  }

  /**
   *  Inject dependencies into this service
   */
  use ({ firebaseAdmin, firebaseClient }) {
    if (firebaseAdmin) {
      _firebaseAdmin = firebaseAdmin;
      UserService.use({ firebase: firebaseAdmin });
    }
    if (firebaseClient) {
      _firebaseClient = firebaseClient;
    }
  }

  /**
   *  Register a new user.
   *  @param {Partial<{password:string}&User>} user
   *  @returns {Promise<User>}
   */
  register (user) {
    return UserService.create(user);
  }

  /**
   *  Sign in.
   *  @param {{email:string,password:string}} { email, password }
   *  @returns {Promise<string>}
   */
  async login ({ email, password }) {
    const cred = await _firebaseClient.signInWithEmailAndPassword(email, password);
    const idToken = await cred.user.getIdToken();
    return idToken;
  }

  async verifyIdToken (idToken) {
    let user = await _firebaseAdmin.verifyIdToken(idToken, true);
    if (!user) { return null; }
    user = await UserService.findOne({ uid: user.uid });
    return user;
  }
}

/** @typedef {import('../models/user').User} User */

const service = new AuthService();

module.exports = service;
