const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Role:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          privilegeIds:
 *            type: array
 *            items:
 *              type: string
 *          _isDeleted:
 *            type: boolean
 */

/**
 *  @typedef
 *  {{
 *      name: string,
 *      description: string,
 *      privilegeIds: string[],
 *      _isDeleted: boolean,
 *    } & import('mongoose').MongooseDocument
 *  } Role
 */
const RoleSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    privilegeIds: [{
      type: Schema.Types.ObjectId,
      ref: collectionNames.PRIVILEGES
    }],
    _isDeleted: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  { collection: collectionNames.ROLES }
);

const RoleDAO = model(collectionNames.ROLES, RoleSchema);

module.exports = RoleDAO;
