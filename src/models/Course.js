const { model, Schema } = require('mongoose');
const collectionNames = require('../../app.config').COLLECTION_NAMES;

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

const Course = model(collectionNames.COURSES, CourseSchema);

module.exports = Course;
