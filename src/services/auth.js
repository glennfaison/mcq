let UserService = require('./user');
const firebaseClient = require('./firebase-client');

class AuthService {
  constructor () {
    if (AuthService.instance) { return AuthService.instance; }
  }

  /**
   *  Pass in an object to be used as a dependency of the UserService.
   *  Note that this is intended for injecting mock dependencies.
   *  @param {{userService:any}} { firebaseAdmin }
   *  @returns {void}
   */
  use ({ userService }) {
    if (userService) { UserService = userService; }
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
    const cred = await firebaseClient.signInWithEmailAndPassword(email, password);
    const idToken = await cred.user.getIdToken();
    return idToken;
  }
}

/** @typedef {import('../models/user').User} User */

const service = new AuthService();

module.exports = service;
