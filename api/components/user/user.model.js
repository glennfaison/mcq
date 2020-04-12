const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          uid:
 *            type: string
 *          email:
 *            type: string
 *          emailVerified:
 *            type: string
 *          displayName:
 *            type: string
 *          photoURL:
 *            type: string
 *          phoneNumber:
 *            type: string
 *          disabled:
 *            type: boolean
 *          passwordHash:
 *            type: string
 *          passwordSalt:
 *            type: string
 *          tokensValidAfterTime:
 *            type: string
 *            format: date-time
 *          roleId:
 *            type: string
 */

/**
 *  @typedef
 *  {{
 *      id: string,
 *      uid: string,
 *      email: string,
 *      emailVerified: boolean,
 *      displayName: string,
 *      photoURL: string,
 *      phoneNumber: string,
 *      disabled: boolean,
 *      passwordHash: string,
 *      passwordSalt: string,
 *      tokensValidAfterTime: Date,
 *      roleId: string,
 *      _isDeleted: boolean,
 *    }
 *    & import('mongoose').MongooseDocument
 *  } User
 */
const UserSchema = new Schema({
  uid: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  displayName: {
    type: String,
    default: null,
    required: true
  },
  photoURL: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  passwordHash: {
    type: String,
    default: null
  },
  passwordSalt: {
    type: String,
    default: null
  },
  tokensValidAfterTime: {
    type: Date,
    default: null
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.ROLES
  }
}, { collection: collectionNames.USERS });

UserSchema.methods.toJSON = function () {
  const user = {
    id: this.id,
    _id: this._id,
    uid: this.uid,
    email: this.email,
    emailVerified: this.emailVerified,
    displayName: this.displayName,
    photoURL: this.photoURL,
    phoneNumber: this.phoneNumber,
    disabled: this.disabled,
    passwordHash: this.passwordHash,
    passwordSalt: this.passwordSalt,
    tokensValidAfterTime: this.tokensValidAfterTime,
    roleId: this.roleId
  };
  if (this.password) { user.password = this.password; }
  return user;
};

const User = model(collectionNames.USERS, UserSchema);

module.exports = User;
