import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      if (user.role === 'employee') {
        navigate('/employee/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/dashboard');
      }
    }
  }, [user, isSuccess, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        
        {isError && (
          <div className="alert alert-error" style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#ef4444' }}>
            {message || 'Login failed. Please try again.'}
            {message?.includes('Database') && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                <strong>Note:</strong> The database is not connected. Please:
                <ol style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li>Login to MongoDB Atlas</li>
                  <li>Add your IP address to the whitelist (0.0.0.0/0 for all IPs)</li>
                  <li>Restart the backend server</li>
                </ol>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
