const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;
const setUpMongoose = require('../../bootstrap/mongoose');
setUpMongoose();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Topic:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          courseId:
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
 *      courseId: string,
 *      createdBy: string,
 *      _isDeleted: boolean,
 *    }
 *    & import('mongoose').MongooseDocument
 *  } QuizResult
 */
const TopicSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
      unique: false
    },
    description: {
      type: String,
      required: true
    },
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: collectionNames.COURSES
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
  { collection: collectionNames.TOPICS }
);

const Topic = model(collectionNames.TOPICS, TopicSchema);

module.exports = Topic;
