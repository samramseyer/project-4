import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🏁</span>
            <span className="logo-text">TechHelp Hub</span>
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/questions">Questions</Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/users">Users</Link>
                </li>
                <li>
                  <Link to="/items">Items</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <Link to="/ask" className="btn btn-ask">
                Ask Question
              </Link>
              <span className="user-info">
                <span className="user-icon">👤</span>
                {user?.username}
                <span className="reputation">⭐ {user?.reputation || 0}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
