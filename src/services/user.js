const UserModel = require('../models/User');
const Firebase = require('./firebase');
const mixin = require('../../helpers/mixin');

/** @type {UserService&import('mongoose').Model} */
let service = {};

/**
 *  @typedef {{use: Function}} UserService
 */

/**
 *  Pass in an object to be used as a dependency of the UserService.
 *  Note that this is intended for injecting mock dependencies.
 *  @param {{firebaseAdmin:any,firebaseClient:any}} { firebaseAdmin, firebaseClient }
 *  @returns {void}
 */
service.use = ({ firebaseAdmin, firebaseClient }) => {
  if (firebaseAdmin) { Firebase.admin = firebaseAdmin; }
  if (firebaseClient) { Firebase.client = firebaseClient; }
};

service.create = async (user) => {
  const newUser = await UserModel.create(user);
  const id = newUser._id.toString();
  try {
    const firebaseUser = await Firebase.admin.createUser({ ...user, uid: id });
    await UserModel.findOneAndUpdate({ _id: id }, firebaseUser);
    return await UserModel.findOne({ _id: id });
  } catch (e) {
    UserModel.findOneAndDelete({ _id: id });
    Firebase.admin.deleteUser(id);
    throw e;
  }
};

service.findOneAndUpdate = async (conditions, user) => {
  delete user.id;
  delete user._id;
  await UserModel.findOneAndUpdate(conditions, user);
  const res = await UserModel.findOne(conditions);
  Firebase.admin.updateUser(res._id.toString(), res);
  return res;
};

service.findOneAndDelete = async (conditions) => {
  try {
    const first = await UserModel.findOneAndDelete(conditions);
    await Firebase.admin.deleteUser(first._id.toString()).catch();
  } catch (e) {
    console.log(e);
    throw e;
  }
};
service.findByIdAndUpdate = (id, ...others) => service.findOneAndUpdate({ _id: id }, ...others);
service.findByIdAndDelete = (id, ...others) => service.findOneAndDelete({ _id: id }, ...others);

service = mixin(UserModel, service);

module.exports = service;

/** @typedef {import('../models/user').User} User */
