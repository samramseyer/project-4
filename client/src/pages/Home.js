import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getQuestions } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchRecentQuestions();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchRecentQuestions = async () => {
    try {
      const data = await getQuestions({ sort: 'newest' });
      setRecentQuestions(data.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  return (
    <div className="home">
      <div className="hero-section card">
        <div className="hero-content">
          <h1>
            <span className="logo-icon">🏁</span>
            Welcome to TechHelp Hub
          </h1>
          <p className="hero-subtitle">
            A Q&A community for developers to ask questions, share knowledge, and help each other grow
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-icon">❓</span>
              <span className="stat-text">Ask Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💬</span>
              <span className="stat-text">Get Answers</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <span className="stat-text">Earn Reputation</span>
            </div>
          </div>

          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/questions" className="btn btn-primary btn-lg">
                  Browse Questions
                </Link>
                <Link to="/ask" className="btn btn-secondary btn-lg">
                  Ask a Question
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/questions" className="btn btn-secondary btn-lg">
                  Browse Questions
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="categories-section">
        <h2>Explore Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/questions?category=${category._id}`}
              key={category._id}
              className="category-card"
              style={{ borderColor: category.color }}
            >
              <div className="category-icon" style={{ backgroundColor: category.color + '20' }}>
                <span style={{ fontSize: '2rem' }}>{category.icon}</span>
              </div>
              <h3 style={{ color: category.color }}>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {recentQuestions.length > 0 && (
        <div className="recent-questions-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Recent Questions</h2>
            <Link to="/questions" className="view-all-link">View All →</Link>
          </div>
          <div className="questions-preview">
            {recentQuestions.map((question) => (
              <Link
                to={`/questions/${question._id}`}
                key={question._id}
                className="question-preview-item"
              >
                <h3>{question.title}</h3>
                <div className="question-preview-meta">
                  {question.category && (
                    <span
                      className="category-badge-sm"
                      style={{ backgroundColor: question.category.color + '20', color: question.category.color }}
                    >
                      {question.category.icon} {question.category.name}
                    </span>
                  )}
                  <span>by {question.author?.username}</span>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="features-section card">
        <h2>Why TechHelp Hub?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>🎯 Focused Topics</h3>
            <p>Organized categories for JavaScript, Python, React, Databases, and Node.js</p>
          </div>
          <div className="feature-item">
            <h3>⚡ Fast Responses</h3>
            <p>Get quick answers from experienced developers in the community</p>
          </div>
          <div className="feature-item">
            <h3>🌟 Reputation System</h3>
            <p>Earn reputation points by asking good questions and providing helpful answers</p>
          </div>
          <div className="feature-item">
            <h3>✅ Accepted Answers</h3>
            <p>Mark answers as accepted to help future visitors find the best solution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
