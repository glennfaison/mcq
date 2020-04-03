const User = require('../models/User');
const Firebase = require('./firebase');
const mixin = require('../../helpers/mixin');

const create = async (user, callback) => {
  const newUser = await User.create(user);
  const id = newUser._id.toString();
  try {
    const firebaseUser = await Firebase.admin.createUser({ ...user, uid: id });
    await User.findOneAndUpdate({ _id: id }, firebaseUser);
    return await User.findOne({ _id: id });
  } catch (e) {
    User.findOneAndDelete({ _id: id });
    Firebase.admin.deleteUser(id);
    throw e;
  }
};

const findOneAndUpdate = async (conditions, user) => {
  delete user.id;
  delete user._id;
  await User.findOneAndUpdate(conditions, user);
  const res = await User.findOne(conditions);
  Firebase.admin.updateUser(res._id.toString(), res);
  return res;
};

const findOneAndDelete = async (conditions) => {
  try {
    const first = await User.findOneAndDelete(conditions);
    await Firebase.admin.deleteUser(first._id.toString()).catch();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

/**
 *  @type {User}
 */
const handler = {
  create: create,
  findOneAndUpdate: findOneAndUpdate,
  findOneAndDelete: findOneAndDelete,
  findByIdAndUpdate: (id, ...others) => findOneAndUpdate({ _id: id }, ...others),
  findByIdAndDelete: (id, ...others) => findOneAndDelete({ _id: id }, ...others)
};

/**
 *  @type {User}
 */
const service = mixin(User, handler);

module.exports = service;
