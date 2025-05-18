import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login(formData);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div>
          <h2 className="login-title">Sign in to your account</h2>
        </div>
        {error && (
          <div className="login-error">{error}</div>
        )}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <div>
              <input
                name="email"
                type="email"
                required
                className="login-input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="login-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="login-button"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}