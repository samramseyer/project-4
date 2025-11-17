import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem, getUsers } from '../services/api';

const CreateItem = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    price: '',
    user: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.data);
      if (data.data.length > 0) {
        setFormData(prev => ({ ...prev, user: data.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
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
    
    if (!formData.title || !formData.description || !formData.price || !formData.user) {
      setError('All fields are required');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createItem(formData);
      navigate('/items');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create item');
      console.error('Error creating item:', err);
    } finally {
      setLoading(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="card">
        <h1>Create New Item</h1>
        <p className="error">Please create a user first before creating items.</p>
        <button onClick={() => navigate('/users/create')} className="btn btn-primary">
          Create User
        </button>
      </div>
    );
  }

  return (
    <div className="create-item-page">
      <h1>Create New Item</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="4"
              maxLength="500"
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>User:</label>
            <select
              name="user"
              value={formData.user}
              onChange={handleChange}
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="btn-group" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Item'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/items')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
