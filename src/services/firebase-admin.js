const mixin = require('../../helpers/mixin');
const setUp = require('../../bootstrap/firebase-admin');

let _firebaseAdmin = setUp();

/**
 *  @type {{
 *    use: ({firebase}) => void
 *  } & import('firebase-admin').auth.Auth}
 */
let admin = {};

/**
 *  Inject dependencies into this service
 *  @param {{firebase:any}} { firebase }
 */
admin.use = ({ firebase }) => {
  if (firebase) { _firebaseAdmin = firebase; }
};

admin.getUser = async (uid) => {
  if (!uid) { return null; }
  uid = uid && uid.toString();
  let user = null;
  user = await _firebaseAdmin.auth().getUser(uid).catch(e => {});
  return user;
};

admin.getUserByEmail = async (email) => {
  if (!email) { return null; }
  email = email && email.toString();
  let user = null;
  user = await _firebaseAdmin.auth().getUserByEmail(email).catch(e => {});
  return user;
};

admin.getUserByPhoneNumber = async (phoneNumber) => {
  if (!phoneNumber) { return null; }
  phoneNumber = phoneNumber && phoneNumber.toString();
  let user = null;
  user = await _firebaseAdmin.auth().getUserByPhoneNumber(phoneNumber).catch(e => {});
  return user;
};

admin.updateUser = async (uid, properties) => {
  delete properties._id;
  delete properties.id;

  if (!uid) { return null; }
  uid = uid && uid.toString();
  const user = await _firebaseAdmin.auth().updateUser(uid, properties).catch(e => {});
  return user || null;
};

admin.deleteUser = async (uid) => {
  if (!uid) { return; }
  uid = uid && uid.toString();
  await _firebaseAdmin.auth().deleteUser(uid).catch(e => {});
};

admin.createUser = async (properties) => {
  if (!properties.uid && (properties._id || properties.id)) {
    properties.uid = properties.id.toString() || properties._id.toString();
  }
  let user = null;
  user = await _firebaseAdmin.auth().createUser(properties).catch(e => {});
  return user;
};

admin = mixin(_firebaseAdmin.auth(), admin);

module.exports = admin;
