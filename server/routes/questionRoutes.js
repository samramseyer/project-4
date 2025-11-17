const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion
} = require('../controllers/questionController');
const { protect, optionalAuth } = require('../middleware/auth');

// Import answer routes to nest them
const answerRouter = require('./answerRoutes');

// Re-route into answer router
router.use('/:questionId/answers', answerRouter);

router.route('/')
  .get(optionalAuth, getQuestions)
  .post(protect, createQuestion);

router.route('/:id')
  .get(optionalAuth, getQuestion)
  .put(protect, updateQuestion)
  .delete(protect, deleteQuestion);

router.post('/:id/vote', protect, voteQuestion);

module.exports = router;
