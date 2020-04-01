const UserService = require('./user');
const Firebase = require('./firebase');

class AuthService {
  constructor () {
    if (AuthService.instance) { return AuthService.instance; }
  }

  register (user) {
    return UserService.create(user);
  }

  async login ({ email, password }) {
    const cred = await Firebase.client.signInWithEmailAndPassword(email, password);
    const idToken = await cred.user.getIdToken();
    return idToken;
  }
}

const service = new AuthService();

module.exports = service;
