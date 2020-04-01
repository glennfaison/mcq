const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

const Quiz = require('./quiz');
const Question = require('./question');

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
