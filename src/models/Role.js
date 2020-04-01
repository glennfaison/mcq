const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: true
    },
    privileges: {
      type: [Schema.Types.ObjectId],
      ref: collectionNames.USERS
    },
    _isDeleted: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  { collection: collectionNames.ROLES }
);

const Role = model(collectionNames.ROLES, RoleSchema);

module.exports = Role;
