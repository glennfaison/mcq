const UserModel = require('../models/User');
const firebaseAdmin = require('./firebase-admin');
const mixin = require('../../helpers/mixin');

class _UserService {
  async create (user) {
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
  }

  async findOneAndUpdate (conditions, user) {
    delete user.id;
    delete user._id;
    const res = await UserModel.findOneAndUpdate(conditions, user, { new: true });
    firebaseAdmin.updateUser(res._id.toString(), res);
    return res;
  }

  async findOneAndDelete (conditions) {
    try {
      const first = await UserModel.findOneAndDelete(conditions);
      await firebaseAdmin.deleteUser(first._id.toString()).catch();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  findByIdAndUpdate (id, ...others) {
    return this.findOneAndUpdate({ _id: id }, ...others);
  }

  findByIdAndDelete (id, ...others) {
    return this.findOneAndDelete({ _id: id }, ...others);
  }
}

/** @typedef {_UserService&import('mongoose').Model} UserService */
/** @typedef {import('../models/user').User} User */

/** @type {UserService} */
const service = mixin(UserModel, new _UserService());

module.exports = service;
