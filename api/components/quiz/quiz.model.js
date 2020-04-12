const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

const TopicModel = require('../topic/topic.model');
const QuestionModel = require('../question/question.model');

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
 *          questionCount:
 *            type: string
 *          topicIdList:
 *            type: array
 *            items:
 *              type: string
 *          questionIdList:
 *            type: array
 *            items:
 *              type: string
 *          topicList:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Topic'
 *          questionList:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Question'
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
 *      topicList: import('../topic/topic.model').Topic[],
 *      questionList: import('../question/question.model').Question[],
 *      createdBy: string,
 *      _isDeleted: boolean,
 *    }
 *    & import('mongoose').MongooseDocument
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
    questionCount: {
      type: Number,
      default: 1
    },
    topicIdList: [{
      type: Schema.Types.ObjectId,
      ref: collectionNames.TOPICS
    }],
    questionIdList: [{
      type: Schema.Types.ObjectId,
      ref: collectionNames.QUESTIONS
    }],
    topicList: {
      type: [TopicModel.schema],
      required: false
    },
    questionList: {
      type: [QuestionModel.schema],
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
  { collection: collectionNames.QUIZZES }
);

const Quiz = model(collectionNames.QUIZZES, QuizSchema);

module.exports = Quiz;
