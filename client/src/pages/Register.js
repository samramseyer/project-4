import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value || value.trim() === '') {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;

      case 'email':
        if (!value || value.trim() === '') {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value || value.trim() === '') {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;

      case 'confirmPassword':
        if (!value || value.trim() === '') {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'agreeToTerms':
        if (!value) {
          error = 'You must agree to the terms and conditions';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: fieldValue
    });

    // Clear error for this field when user starts typing
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors({
        ...errors,
        [name]: error
      });

      // Also revalidate confirmPassword if password changes
      if (name === 'password' && touched.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        setErrors(prev => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    const error = validateField(name, formData[name]);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
      agreeToTerms: validateField('agreeToTerms', formData.agreeToTerms)
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      return;
    }

    try {
      setLoading(true);
      const data = await apiRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      login(data.user);
      navigate('/questions');
    } catch (err) {
      setErrors({
        ...errors,
        email: err.response?.data?.error || 'Failed to register'
      });
      console.error('Error registering:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Join TechHelp Hub</h1>
        <p className="auth-subtitle">Create an account to ask and answer questions!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group-with-error">
            <label>Username:</label>
            <div className="input-error-container">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Choose a username"
                className={touched.username && errors.username ? 'input-error' : ''}
              />
              {touched.username && errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
          </div>

          <div className="form-group-with-error">
            <label>Email:</label>
            <div className="input-error-container">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={touched.email && errors.email ? 'input-error' : ''}
              />
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-group-with-error">
            <label>Password:</label>
            <div className="input-error-container">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password (min 6 characters)"
                className={touched.password && errors.password ? 'input-error' : ''}
              />
              {touched.password && errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          </div>

          <div className="form-group-with-error">
            <label>Confirm Password:</label>
            <div className="input-error-container">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group-with-error checkbox-group">
            <div className="input-error-container checkbox-container">
              <label className={`checkbox-label ${touched.agreeToTerms && errors.agreeToTerms ? 'checkbox-error' : ''}`}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span>I agree to the terms and conditions</span>
              </label>
              {touched.agreeToTerms && errors.agreeToTerms && (
                <span className="error-message checkbox-error-message">{errors.agreeToTerms}</span>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
