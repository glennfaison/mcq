const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Course:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          courseCode:
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
 *      courseCode: string,
 *      createdBy: string,
 *      _isDeleted: boolean,
 *    } & import('mongoose').MongooseDocument
 *  } Course
 */
const CourseSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    courseCode: {
      type: String,
      required: false
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: collectionNames.USERS
    },
    _isDeleted: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  { collection: collectionNames.COURSES }
);

const CourseModel = model(collectionNames.COURSES, CourseSchema);

module.exports = CourseModel;
