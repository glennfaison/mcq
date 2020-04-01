const User = require('../models/User');
const Firebase = require('./firebase');

const service = User;

service.create = async (user, callback) => {
  const { id } = await User.create(user);
  try {
    const firebaseUser = await Firebase.admin.createUser({ ...user, uid: id });
    await User.update({ _id: id }, firebaseUser);
    return await User.findById(id);
  } catch (e) {
    User.deleteOne({ _id: id });
    Firebase.admin.deleteUser(id);
    throw e;
  }
};

service.updateById = async (id, user) => {
  delete user.id;
  delete user._id;
  await User.update({ _id: id }, user);
  const res = await User.findById(id);
  Firebase.admin.updateUser(id, res);
};

service.deleteById = async (id) => {
  User.deleteOne({ _id: id });
  Firebase.admin.deleteUser(id);
};

module.exports = service;
