const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      UserAnswer:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          questionId:
 *            type: string
 *          selectedOptionIndices:
 *            type: array
 *            items:
 *              type: number
 *          isCorrect:
 *            type: boolean
 */

/**
 *  @typedef
 *  {{
 *      questionId: string,
 *      selectedOptionIndices: number[],
 *      isCorrect: boolean,
 *  }} UserAnswer
 */
const UserAnswerSchema = new Schema({
  questionId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: collectionNames.QUESTIONS
  },
  selectedOptionIndices: [Number],
  isCorrect: {
    type: Boolean,
    required: false,
    default: false
  }
});

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Result:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          userId:
 *            type: string
 *          quizId:
 *            type: string
 *          score:
 *            type: number
 *          userAnswerList:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/UserAnswer'
 *          createdBy:
 *            type: string
 *          _isDeleted:
 *            type: boolean
 */

/**
 *  @typedef
 *  {{
 *      userId: string,
 *      quizId: string,
 *      score: number,
 *      userAnswerList: UserAnswer[],
 *      _isDeleted: boolean,
 *    } & import('mongoose').MongooseDocument
 *  } Result
 */
const ResultSchema = new Schema(
  {
    userId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: collectionNames.USERS
    },
    quizId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: collectionNames.QUIZZES
    },
    score: {
      type: Number,
      required: false
    },
    userAnswerList: {
      type: [UserAnswerSchema],
      default: []
    },
    _isDeleted: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  { collection: collectionNames.RESULTS }
);

ResultSchema.index({ userId: 1, quizId: 1 }, { unique: true });

const ResultModel = model(collectionNames.RESULTS, ResultSchema);

module.exports = ResultModel;
