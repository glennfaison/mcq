const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;
const setUpMongoose = require('../../bootstrap/mongoose');
setUpMongoose();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Privilege:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          type:
 *            type: string
 *          createdBy:
 *            type: string
 *          _isDeleted:
 *            type: boolean
 */

/**
 *  @typedef
 *  {{
 *      name: string,
 *      description: string,
 *      type: string,
 *      _isDeleted: boolean,
 *    }
 *    & import('mongoose').MongooseDocument
 *  } Privilege
 */
const PrivilegeSchema = new Schema(
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
    type: {
      type: String,
      required: true
    },
    _isDeleted: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  { collection: collectionNames.PRIVILEGES }
);

const Privilege = model(collectionNames.PRIVILEGES, PrivilegeSchema);

module.exports = Privilege;
