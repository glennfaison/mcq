const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Quiz:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          timeAllowed:
 *            type: number
 *          topicIdList:
 *            type: array
 *            items:
 *              type: string
 *          questionIdList:
 *            type: array
 *            items:
 *              type: string
 *          expiresAt:
 *            type: date
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
 *      timeAllowed: number,
 *      questionCount: number,
 *      topicIdList: string[],
 *      questionIdList: string[],
 *      expiresAt: date,
 *      createdBy: string,
 *      _isDeleted: boolean,
 *    } & import('mongoose').MongooseDocument
 *  } Quiz
 */
const QuizSchema = new Schema(
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
    timeAllowed: {
      type: Number,
      required: true,
      default: 60000 // One minute, in milliseconds.
    },
    topicIdList: [{
      type: Schema.Types.ObjectId,
      ref: collectionNames.TOPICS
    }],
    questionIdList: [{
      type: Schema.Types.ObjectId,
      ref: collectionNames.QUESTIONS
    }],
    expiresAt: Date,
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
  { collection: collectionNames.QUIZZES }
);

const Quiz = model(collectionNames.QUIZZES, QuizSchema);

module.exports = Quiz;
