import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions, getCategories } from '../services/api';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sort = sortBy;
      
      const data = await getQuestions(params);
      setQuestions(data.data);
      setError('');
    } catch (err) {
      setError('Failed to load questions. Make sure the server is running.');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const getVoteCount = (question) => {
    return (question.upvotes?.length || 0) - (question.downvotes?.length || 0);
  };

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <div className="questions-page">
      <div className="questions-header">
        <div>
          <h1>All Questions</h1>
          <p className="subtitle">Ask questions and help others learn</p>
        </div>
        <Link to="/ask" className="btn btn-primary">
          Ask Question
        </Link>
      </div>

      <div className="questions-layout">
        {/* Left Sidebar - Category Menu */}
        <aside className="category-sidebar">
          <h3 className="sidebar-title">CATEGORIES</h3>
          <div className="category-menu">
            <button
              className={`category-menu-item ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              <span className="category-icon">📋</span>
              <span className="category-name">All Categories</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-menu-item ${selectedCategory === cat._id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="questions-main">
          <div className="filters">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="views">Most Views</option>
                <option value="votes">Most Votes</option>
              </select>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          {questions.length === 0 ? (
            <div className="empty-state">
              <p>No questions found.</p>
              <Link to="/ask" className="btn btn-primary">
                Ask the First Question
              </Link>
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((question) => (
                <Link
                  to={`/questions/${question._id}`}
                  key={question._id}
                  className="question-item"
                >
                  <div className="question-stats">
                    <div className="stat">
                      <span className="stat-number">{getVoteCount(question)}</span>
                      <span className="stat-label">votes</span>
                    </div>
                    <div className={`stat ${question.isSolved ? 'solved' : ''}`}>
                      <span className="stat-number">{question.answers?.length || 0}</span>
                      <span className="stat-label">answers</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{question.views}</span>
                      <span className="stat-label">views</span>
                    </div>
                  </div>

                  <div className="question-content">
                    <h3 className="question-title">
                      {question.title}
                      {question.isSolved && <span className="solved-badge">✓ Solved</span>}
                    </h3>
                    <p className="question-body">{question.body.substring(0, 150)}...</p>
                    <div className="question-meta">
                      {question.category && (
                        <span 
                          className="category-badge"
                          style={{ backgroundColor: question.category.color + '20', color: question.category.color }}
                        >
                          {question.category.icon} {question.category.name}
                        </span>
                      )}
                      {question.tags && question.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                      <span className="author-info">
                        asked by <strong>{question.author?.username || 'Anonymous'}</strong>
                        <span className="date">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
