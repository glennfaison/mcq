const QuizResultModel = require('./quiz-result.model');
const mixin = require('../../helpers/mixin');
const QuestionService = require('../question/question.service');

class _QuizResultService {
  findOneAndUpdate (conditions, properties) {
    return QuizResultModel.findOneAndUpdate(conditions, properties, { new: true });
  }

  findByIdAndUpdate (id, properties) {
    return this.findOneAndUpdate({ _id: id }, properties);
  }

  /**
   *  Evaluate a user's answer
   *  @memberof _QuizResultService
   *  @param {UserAnswer} userAnswer
   *  @returns {Promise<UserAnswer>} the corrected `UserAnswer`
   */
  async evaluateUserAnswer (userAnswer) {
    /** @type {Question} */
    const question = await QuestionService.findById(userAnswer.questionId);
    userAnswer.selectedOptionIndices = Array.from(new Set(userAnswer.selectedOptionIndices));
    if (question.correctOptionIndices.length !== userAnswer.selectedOptionIndices) {
      userAnswer.isCorrect = false;
    }
    userAnswer.isCorrect = userAnswer.selectedOptionIndices
      .every(ans => question.correctOptionIndices.includes(ans));
    return userAnswer;
  }

  /**
   *  Evaluate a user's Quiz submission
   *  @param {QuizResult} quizResult
   *  @memberof _QuizResultService
   *  @returns {QuizResult} the corrected `QuizResult`
   */
  async evaluateQuiz (quizResult) {
    const promises = quizResult.userAnswerList.map(this.evaluateUserAnswer);
    quizResult.userAnswerList = await Promise.allSettled(promises);
    // Count all items of `quizResult.userAnswerList` where `isCorrect` is `true`
    quizResult.score = quizResult.userAnswerList.reduce((score, ans) => ans.isCorrect ? score + 1 : score);
    return quizResult;
  }
}

/** @typedef {_QuizResultService & import('mongoose').Model} QuizResultService */
/** @typedef {import('./quiz-result.model').QuizResult} QuizResult */
/** @typedef {import('./quiz-result.model').UserAnswer} UserAnswer */
/** @typedef {import('../question/question.model').Question} Question */

/** @type {QuizResultService} */
const service = mixin(QuizResultModel, new _QuizResultService());

module.exports = service;
