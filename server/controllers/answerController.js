const Answer = require('../models/Answer');
const Question = require('../models/Question');

// @desc    Get answers for a question
// @route   GET /api/questions/:questionId/answers
// @access  Public
exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username reputation createdAt')
      .sort('-isAccepted -upvotes createdAt');
    
    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single answer
// @route   GET /api/answers/:id
// @access  Public
exports.getAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate('author', 'username reputation createdAt');
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new answer
// @route   POST /api/questions/:questionId/answers
// @access  Private
exports.createAnswer = async (req, res) => {
  try {
    req.body.author = req.user.id;
    req.body.question = req.params.questionId;
    
    // Check if question exists
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    const answer = await Answer.create(req.body);
    
    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'username reputation');
    
    res.status(201).json({
      success: true,
      data: populatedAnswer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
exports.updateAnswer = async (req, res) => {
  try {
    let answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found'
      });
    }
    
    // Make sure user is answer owner
    if (answer.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this answer'
      });
    }
    
    answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username reputation');
    
    res.status(200).json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found'
      });
    }
    
    // Make sure user is answer owner
    if (answer.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this answer'
      });
    }
    
    await answer.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Vote on answer
// @route   POST /api/answers/:id/vote
// @access  Private
exports.voteAnswer = async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found'
      });
    }
    
    const userId = req.user.id;
    
    // Remove existing votes
    answer.upvotes = answer.upvotes.filter(id => id.toString() !== userId);
    answer.downvotes = answer.downvotes.filter(id => id.toString() !== userId);
    
    // Add new vote
    if (vote === 'up') {
      answer.upvotes.push(userId);
    } else if (vote === 'down') {
      answer.downvotes.push(userId);
    }
    
    await answer.save();
    
    res.status(200).json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Accept answer
// @route   POST /api/answers/:id/accept
// @access  Private
exports.acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        error: 'Answer not found'
      });
    }
    
    const question = await Question.findById(answer.question);
    
    // Make sure user is question owner
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Only question author can accept answers'
      });
    }
    
    // Remove accepted status from other answers
    await Answer.updateMany(
      { question: question._id },
      { isAccepted: false }
    );
    
    // Set this answer as accepted
    answer.isAccepted = true;
    await answer.save();
    
    // Update question
    question.isSolved = true;
    question.acceptedAnswer = answer._id;
    await question.save();
    
    res.status(200).json({
      success: true,
      data: answer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
