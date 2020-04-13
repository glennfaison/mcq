const ResultModel = require('./result.model');
const QuestionService = require('../question/question.service');
const GenericCrudService = require('../../helpers/generic-crud-service');

class ResultService extends GenericCrudService {
  constructor () {
    super(ResultModel);
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

const service = new ResultService();

module.exports = service;