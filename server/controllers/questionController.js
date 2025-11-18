const Question = require('../models/Question');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search in title and body
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } }
      ];
    }
    
    let questionQuery = Question.find(query)
      .populate('author', 'username reputation')
      .populate('category', 'name color icon');
    
    // Sort
    if (sort === 'newest') {
      questionQuery = questionQuery.sort('-createdAt');
    } else if (sort === 'oldest') {
      questionQuery = questionQuery.sort('createdAt');
    } else if (sort === 'views') {
      questionQuery = questionQuery.sort('-views');
    } else if (sort === 'votes') {
      questionQuery = questionQuery.sort('-upvotes');
    } else {
      // Default: sort by newest (chronological)
      questionQuery = questionQuery.sort('-createdAt');
    }
    
    const questions = await questionQuery;
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username reputation createdAt')
      .populate('category', 'name color icon');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    // Increment views
    question.views += 1;
    await question.save();
    
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
exports.createQuestion = async (req, res) => {
  try {
    req.body.author = req.user.id;
    
    const question = await Question.create(req.body);
    
    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'username reputation')
      .populate('category', 'name color icon');
    
    res.status(201).json({
      success: true,
      data: populatedQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    // Make sure user is question owner
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this question'
      });
    }
    
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'username reputation')
      .populate('category', 'name color icon');
    
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    // Make sure user is question owner
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this question'
      });
    }
    
    await question.deleteOne();
    
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

// @desc    Vote on question
// @route   POST /api/questions/:id/vote
// @access  Private
exports.voteQuestion = async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    const userId = req.user.id;
    
    // Remove existing votes
    question.upvotes = question.upvotes.filter(id => id.toString() !== userId);
    question.downvotes = question.downvotes.filter(id => id.toString() !== userId);
    
    // Add new vote
    if (vote === 'up') {
      question.upvotes.push(userId);
    } else if (vote === 'down') {
      question.downvotes.push(userId);
    }
    
    await question.save();
    
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
