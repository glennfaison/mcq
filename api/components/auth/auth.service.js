const UserService = require('../user/user.service');
let _firebaseAdmin = require('../user/firebase-admin.service');
let _firebaseClient = require('../user/firebase-client.service');

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
    const { email, password } = user;
    if (!email) {
      throw new Error('The \'email\' field is required');
    }
    if (!password) {
      throw new Error('The \'password\' field is required');
    }
    return UserService.create(user);
  }

  /**
   *  Sign in.
   *  @param {{email:string,password:string}} { email, password }
   *  @returns {Promise<string>}
   */
  async login ({ email, password }) {
    if (!email) {
      throw new Error('The \'email\' field is required');
    }
    if (!password) {
      throw new Error('The \'password\' field is required');
    }
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

/** @typedef {import('../user/user.model').User} User */

const service = new AuthService();

module.exports = service;
