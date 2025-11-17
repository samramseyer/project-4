import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuestion, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AskQuestion = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [isAuthenticated, navigate]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data);
      if (data.data.length > 0) {
        setFormData(prev => ({ ...prev, category: data.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.body || !formData.category) {
      setError('Title, body, and category are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const questionData = {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      const data = await createQuestion(questionData);
      navigate(`/questions/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create question');
      console.error('Error creating question:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-question-page">
      <h1>Ask a Question</h1>
      <p className="subtitle">Get help from the TechHelp Hub community</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. How do I use useState in React?"
              maxLength="200"
            />
            <small>Be specific and imagine you're asking a question to another person</small>
          </div>

          <div className="form-group">
            <label>Body:</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Include all the information someone would need to answer your question..."
              rows="10"
              maxLength="5000"
            />
            <small>Provide as much detail as possible. Include code examples if relevant.</small>
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags (optional):</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. react, hooks, state (comma-separated)"
            />
            <small>Add up to 5 tags to describe what your question is about</small>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="btn-group" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Your Question'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/questions')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="tips-card card" style={{ marginTop: '20px' }}>
        <h3>Tips for asking a good question:</h3>
        <ul style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '2' }}>
          <li>Make your title specific and clear</li>
          <li>Describe what you've tried and what didn't work</li>
          <li>Include relevant code snippets or error messages</li>
          <li>Explain what you expect to happen</li>
          <li>Use proper formatting and grammar</li>
        </ul>
      </div>
    </div>
  );
};

export default AskQuestion;
