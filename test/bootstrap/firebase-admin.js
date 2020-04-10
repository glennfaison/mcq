const crypto = require('crypto');
const FirebaseDb = require('./firebase-db');

class _FirebaseAdmin {
  async createUser (properties) {
    properties = { ...properties };
    if (!properties.uid && (properties._id || properties.id)) {
      properties.uid = properties.id.toString() || properties._id.toString();
    } else {
      properties.uid = FirebaseDb.makeId(24);
    }
    // Delete `password` field and replace with `passwordHash` and `passwordSalt`
    const password = properties.password;
    delete properties.password;
    properties.passwordSalt = crypto.randomBytes(256).toString('hex').substring(0, 512);
    properties.passwordHash = crypto
      .createHmac('sha512', properties.passwordSalt)
      .update(password).digest('hex');

    FirebaseDb.db[properties.uid] = properties;
    FirebaseDb.db[properties.email] = properties;
    FirebaseDb.db[properties.phoneNumber] = properties;
    return properties;
  }

  async getUser (uid) {
    if (!uid) { return null; }
    const user = FirebaseDb.db[uid.toString()];
    return user;
  }

  getUserByUid (id) {
    return this.getUser(id);
  }

  getUserByEmail (email) {
    return this.getUser(email);
  }

  getUserByPhoneNumber (phoneNumber) {
    return this.getUser(phoneNumber);
  }

  async updateUser (uid, properties) {
    uid = uid && uid.toString();
    let user = this.getUser(uid);
    if (!uid || !user) { return null; }

    user = { ...user, ...properties };
    delete FirebaseDb.db[uid];
    FirebaseDb.db[user.uid] = user;
    FirebaseDb.db[user.email] = user;
    FirebaseDb.db[user.phoneNumber] = user;
    return user;
  }

  updateUserByUid (id) {
    return this.updateUser(id);
  }

  async deleteUser (uid) {
    uid = uid && uid.toString();
    const user = this.getUser(uid);
    uid = uid && uid.toString();
    delete FirebaseDb.db[uid];
    delete FirebaseDb.db[user.email];
    delete FirebaseDb.db[user.phoneNumber];
    return true;
  }

  deleteUserByUid (id) {
    return this.deleteUser(id);
  }

  async verifyIdToken (idToken) {
    const uid = FirebaseDb.idTokens[idToken];
    if (!uid) { return null; }
    return FirebaseDb.db[uid];
  }
}

/**
 *  @type {_FirebaseAdmin & import('firebase-admin').auth.Auth}
 */
const admin = new _FirebaseAdmin();

module.exports = admin;
