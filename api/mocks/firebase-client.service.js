const crypto = require('crypto');
const firebaseAdmin = require('./firebase-admin.service');
const FirebaseDb = require('./firebase-db.service');

class FirebaseClientMock {
  async signInWithEmailAndPassword (email, password) {
    const user = await firebaseAdmin.getUserByEmail(email);

    const passwordHash = crypto
      .createHmac('sha512', user.passwordSalt)
      .update(password).digest('hex');
    if (user.passwordHash !== passwordHash) { return null; }

    const idToken = FirebaseDb.makeId(24);
    FirebaseDb.idTokens[idToken] = user.uid;
    user.getIdToken = async () => idToken;
    return { user };
  }
}

const client = new FirebaseClientMock();

module.exports = client;
