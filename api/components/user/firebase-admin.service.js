const mixin = require('../../helpers/mixin');
const setUp = require('../../configuration/firebase-admin');

let _firebaseAdmin = setUp();

class _FirebaseAdminService {
  /**
   *  Inject dependencies into this service
   *  @param {{firebase:any}} { firebase }
   */
  use ({ firebase }) {
    if (firebase) { _firebaseAdmin = firebase; }
  }

  async getUser (uid) {
    if (!uid) { return null; }
    uid = uid && uid.toString();
    let user = null;
    user = await _firebaseAdmin.auth().getUser(uid).catch(e => {});
    return user;
  }

  async getUserByEmail (email) {
    if (!email) { return null; }
    email = email && email.toString();
    let user = null;
    user = await _firebaseAdmin.auth().getUserByEmail(email).catch(e => {});
    return user;
  }

  async getUserByPhoneNumber (phoneNumber) {
    if (!phoneNumber) { return null; }
    phoneNumber = phoneNumber && phoneNumber.toString();
    let user = null;
    user = await _firebaseAdmin.auth().getUserByPhoneNumber(phoneNumber).catch(e => {});
    return user;
  }

  async updateUser (uid, properties) {
    delete properties._id;
    delete properties.id;

    if (!uid) { return null; }
    uid = uid && uid.toString();
    const user = await _firebaseAdmin.auth().updateUser(uid, properties).catch(e => {});
    return user || null;
  }

  async deleteUser (uid) {
    if (!uid) { return; }
    uid = uid && uid.toString();
    await _firebaseAdmin.auth().deleteUser(uid).catch(e => {});
  }

  async createUser (properties) {
    if (!properties.uid && (properties._id || properties.id)) {
      properties.uid = properties.id.toString() || properties._id.toString();
    }
    let user = null;
    user = await _firebaseAdmin.auth().createUser(properties).catch(e => {});
    return user;
  }
}

/** @typedef {_FirebaseAdminService & import('firebase-admin').auth.Auth} FirebaseAdminService */

/** @type {FirebaseAdminService} */
const admin = mixin(_firebaseAdmin.auth(), new _FirebaseAdminService());

module.exports = admin;
