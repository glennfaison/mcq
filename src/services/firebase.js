const firebaseAdmin = require('firebase-admin');
const firebase = require('firebase');
const mixin = require('../../helpers/mixin');

/** @type {import('mongoose').Model} */
let admin = {
  getUser: async (uid) => {
    if (!uid) { return null; }
    uid = uid && uid.toString();
    let user = null;
    user = await firebaseAdmin.auth().getUser(uid).catch(e => {});
    return user;
  },
  getUserByEmail: async (email) => {
    if (!email) { return null; }
    email = email && email.toString();
    let user = null;
    user = await firebaseAdmin.auth().getUserByEmail(email).catch(e => {});
    return user;
  },
  getUserByPhoneNumber: async (phoneNumber) => {
    if (!phoneNumber) { return null; }
    phoneNumber = phoneNumber && phoneNumber.toString();
    let user = null;
    user = await firebaseAdmin.auth().getUserByPhoneNumber(phoneNumber).catch(e => {});
    return user;
  },
  updateUser: async (uid, properties) => {
    delete properties._id;
    delete properties.id;

    if (!uid) { return null; }
    uid = uid && uid.toString();
    const user = await firebaseAdmin.auth().updateUser(uid, properties).catch(e => {});
    return user || null;
  },
  deleteUser: async (uid) => {
    if (!uid) { return; }
    uid = uid && uid.toString();
    await firebaseAdmin.auth().deleteUser(uid).catch(e => {});
  },
  createUser: async (properties) => {
    if (!properties.uid && (properties._id || properties.id)) {
      properties.uid = properties.id.toString() || properties._id.toString();
    }
    let user = null;
    user = await firebaseAdmin.auth().createUser(properties).catch(e => {});
    return user;
  }
};

/** @type {import('mongoose').Model} */
let client = {};

admin = mixin(firebaseAdmin.auth(), admin);
client = mixin(firebase.auth(), client);

module.exports = { admin, client };
