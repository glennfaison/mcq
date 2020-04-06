const UserModel = require('../models/User');
const firebaseAdmin = require('./firebase-admin');
const mixin = require('../../helpers/mixin');

/** @type {UserService&import('mongoose').Model} */
let service = {};

service.create = async (user) => {
  const newUser = await UserModel.create(user);
  const id = newUser._id.toString();
  try {
    let firebaseUser = await firebaseAdmin.createUser({ ...user, uid: id });

    // #region Sometimes, `createUser` returns `undefined`
    if (!firebaseUser && newUser.email) {
      firebaseUser = await firebaseAdmin.getUserByEmail(user.email);
    }
    if (!firebaseUser && newUser.phoneNumber) {
      firebaseUser = await firebaseAdmin.getUserByPhoneNumber(user.phoneNumber);
    }
    // #endregion Sometimes, `createUser` returns `undefined`

    await UserModel.findOneAndUpdate({ _id: id }, firebaseUser);
    return await UserModel.findOne({ _id: id });
  } catch (e) {
    UserModel.findOneAndDelete({ _id: id });
    firebaseAdmin.deleteUser(id);
    throw e;
  }
};

service.findOneAndUpdate = async (conditions, user) => {
  delete user.id;
  delete user._id;
  await UserModel.findOneAndUpdate(conditions, user);
  const res = await UserModel.findOne(conditions);
  firebaseAdmin.updateUser(res._id.toString(), res);
  return res;
};

service.findOneAndDelete = async (conditions) => {
  try {
    const first = await UserModel.findOneAndDelete(conditions);
    await firebaseAdmin.deleteUser(first._id.toString()).catch();
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
