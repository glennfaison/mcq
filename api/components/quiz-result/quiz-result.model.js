const { model, Schema } = require('mongoose');
const collectionNames = require('../../../app.config').COLLECTION_NAMES;

// const QuizModel = require('../quiz/quiz.model');
// const QuestionModel = require('../question/question.model');

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
 *    }} UserAnswer
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
 *      QuizResult:
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
 *  } QuizResult
 */
const QuizResultSchema = new Schema(
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
  { collection: collectionNames.QUIZ_RESULTS }
);

const QuizResult = model(collectionNames.QUIZ_RESULTS, QuizResultSchema);

module.exports = QuizResult;
