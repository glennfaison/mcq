const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

const Question = require('./Question');
const Topic = require('./Topic');

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
      type: [Topic.schema],
      required: false
    },
    questionList: {
      type: [Question.schema],
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
