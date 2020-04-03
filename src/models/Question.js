const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Question:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          text:
 *            type: string
 *          correctOptionIndices:
 *            type: array
 *            items:
 *              type: number
 *          optionList:
 *            type: array
 *            items:
 *              type: string
 *          topicId:
 *            type: string
 *          createdBy:
 *            type: string
 *          _isDeleted:
 *            type: boolean
 */
const QuestionSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    correctOptionIndices: [Number],
    optionList: [String],
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: collectionNames.TOPICS
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: collectionNames.USERS
    },
    _isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { collection: collectionNames.QUESTIONS }
);

const Question = model(collectionNames.QUESTIONS, QuestionSchema);

module.exports = Question;
