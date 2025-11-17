const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAnswers,
  getAnswer,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer
} = require('../controllers/answerController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getAnswers)
  .post(protect, createAnswer);

router.route('/:id')
  .get(getAnswer)
  .put(protect, updateAnswer)
  .delete(protect, deleteAnswer);

router.post('/:id/vote', protect, voteAnswer);
router.post('/:id/accept', protect, acceptAnswer);

module.exports = router;
