const UserModel = require('../models/User');
let firebaseAdmin = require('./firebase-admin');
const mixin = require('../../helpers/mixin');

class _UserService {
  /**
   *  Inject dependencies into this service
   *  @param {{firebase:any}} { firebase }
   */
  use ({ firebase }) {
    if (firebase) { firebaseAdmin = firebase; }
  }

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

      return await UserModel.findOneAndUpdate({ _id: id }, firebaseUser, { new: true });
    } catch (e) {
      UserModel.findOneAndDelete({ _id: id });
      firebaseAdmin.deleteUser(id);
      throw e;
    }
  }

  async findOneAndUpdate (conditions, user) {
    delete user.id;
    delete user._id;
    try {
      const res = await UserModel.findOneAndUpdate(conditions, user, { new: true });
      firebaseAdmin.updateUser(res.uid, res);
      return res;
    } catch (e) {
      return null;
    }
  }

  async findOneAndDelete (conditions) {
    try {
      const first = await UserModel.findOneAndDelete(conditions);
      await firebaseAdmin.deleteUser(first._id.toString());
    } catch (e) {}
  }

  findByIdAndUpdate (id, ...others) {
    return this.findOneAndUpdate({ _id: id }, ...others);
  }

  findByIdAndDelete (id, ...others) {
    return this.findOneAndDelete({ _id: id }, ...others);
  }

  async findOne (conditions, ...others) {
    try {
      return await UserModel.findOne(conditions, ...others);
    } catch (e) {
      return null;
    }
  }

  findById (id, ...others) {
    return this.findOne({ _id: id }, ...others);
  }

  find (conditions, ...others) {
    try {
      return UserModel.find(conditions, ...others);
    } catch (e) {
      return [];
    }
  }
}

/** @typedef {_UserService&import('mongoose').Model} UserService */
/** @typedef {import('../models/user').User} User */

/** @type {UserService} */
const service = mixin(UserModel, new _UserService());

module.exports = service;
