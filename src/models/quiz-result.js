const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

const Quiz = require('./quiz');
const Question = require('./question');

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
 *          question:
 *            type: object
 *            schema:
 *              $ref: '#/components/schemas/Question'
 *          correctOptionIndices:
 *            type: array
 *            items:
 *              type: number
 *          selectedOptionIndices:
 *            type: array
 *            items:
 *              type: number
 *          optionList:
 *            type: array
 *            items:
 *              type: string
 *          isCorrect:
 *            type: boolean
 */
const UserAnswerSchema = new Schema({
  questionId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: collectionNames.QUESTIONS
  },
  question: {
    type: Question.schema,
    required: false
  },
  correctOptionIndices: [Number],
  selectedOptionIndices: [Number],
  optionList: [String],
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
 *          quiz:
 *            type: object
 *            schema:
 *              $ref: '#/components/schemas/Quiz'
 *          score:
 *            type: number
 *          startedOn:
 *            type: date
 *          isCompleted:
 *            type: boolean
 *          correctOptionIndices:
 *            type: array
 *            items:
 *              type: number
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
 *      quiz: Quiz,
 *      score: number,
 *      startedOn: number,
 *      isCompleted: boolean,
 *      userAnswerList: string[],
 *      createdBy: string,
 *      _isDeleted: boolean,
 *    }
 *    & import('mongoose').MongooseDocument
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
    quiz: {
      required: false,
      type: Quiz.schema
    },
    score: {
      type: Number,
      required: false
    },
    startedOn: Date,
    isCompleted: {
      required: false,
      type: Boolean,
      default: false
    },
    userAnswerList: {
      type: [UserAnswerSchema],
      default: []
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
  { collection: collectionNames.QUIZ_RESULTS }
);

const QuizResult = model(collectionNames.QUIZ_RESULTS, QuizResultSchema);

module.exports = QuizResult;
