const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

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
 *          displayName:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          userRole:
 *            type: string
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

UserSchema.post('save', async function (user, next) {
  user.uid = user.id;
  await model('User').updateOne({ _id: user.id }, { uid: user.id });
  next();
});

const User = model(collectionNames.USERS, UserSchema);

module.exports = User;
