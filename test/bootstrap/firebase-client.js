const firebaseAdmin = require('./firebase-admin');
const FirebaseDb = require('./firebase-db');

class _FirebaseClient {
  async signInWithEmailAndPassword (email, password) {
    const user = await firebaseAdmin.getUserByEmail(email);
    if (user.password !== password) { return null; }
    const idToken = FirebaseDb.makeId(24);
    FirebaseDb.idTokens[idToken] = user.uid;
    user.getIdToken = async () => idToken;
    return { user };
  }
}

const client = new _FirebaseClient();

module.exports = client;
