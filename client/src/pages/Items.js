import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem } from '../services/api';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data.data);
      setError('');
    } catch (err) {
      setError('Failed to load items. Make sure the server is running.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        fetchItems();
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error deleting item:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="items-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Items</h1>
        <Link to="/items/create" className="btn btn-primary">
          Create New Item
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>No items found.</p>
          <Link to="/items/create" className="btn btn-primary">
            Create First Item
          </Link>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h3>{item.title}</h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              {item.user && (
                <p><strong>Created by:</strong> {item.user.name}</p>
              )}
              <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
              <div className="btn-group">
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;
