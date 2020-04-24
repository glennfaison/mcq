const UserDAO = require('./user.dao');
let firebaseAdminService = require('./firebase-admin.service');
const GenericCrudService = require('../../helpers/generic-crud-service');

class UserService extends GenericCrudService {
  constructor () {
    super(UserDAO);
  }

  /**
   *  Inject dependencies into this service
   *  @param {{firebase:any}} { firebase }
   */
  use ({ firebase }) {
    if (firebase) { firebaseAdminService = firebase; }
  }

  async create (user) {
    const newUser = await UserDAO.create(user);
    const id = newUser.id.toString();
    try {
      let firebaseUser = await firebaseAdminService.createUser({ ...user, uid: id });

      // #region Sometimes, `createUser` returns `undefined`
      if (!firebaseUser && newUser.email) {
        firebaseUser = await firebaseAdminService.getUserByEmail(user.email);
      }
      if (!firebaseUser && newUser.phoneNumber) {
        firebaseUser = await firebaseAdminService.getUserByPhoneNumber(user.phoneNumber);
      }
      // #endregion Sometimes, `createUser` returns `undefined`

      return await UserDAO.findOneAndUpdate({ _id: id }, firebaseUser, { new: true });
    } catch (e) {
      UserDAO.findOneAndDelete({ _id: id });
      firebaseAdminService.deleteUser(id);
      throw e;
    }
  }

  async findOneAndUpdate (conditions, properties) {
    const res = await super.findOneAndUpdate(conditions, properties);
    firebaseAdminService.updateUser(res.uid, res);
    return res;
  }

  async findByIdAndUpdate (id, properties) {
    const res = await super.findByIdAndUpdate(id, properties);
    firebaseAdminService.updateUser(res.uid, res);
    return res;
  }

  async findOneAndDelete (conditions) {
    const res = await super.findOneAndDelete(conditions);
    if (!res) { return null; }
    await firebaseAdminService.deleteUser(res.uid);
    return res;
  }

  async findByIdAndDelete (id) {
    const res = await super.findByIdAndDelete(id);
    if (!res) { return null; }
    await firebaseAdminService.deleteUser(res.uid);
    return res;
  }
}

const service = new UserService();

module.exports = service;
