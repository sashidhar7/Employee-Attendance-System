import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isEmployee = user?.role === 'employee';
  const isManager = user?.role === 'manager';

  return (
    <nav className="navbar stylish-nav">
      <div className="navbar-container stylish-nav-inner">

        {/* Logo */}
        <Link
          to={isEmployee ? '/employee/dashboard' : '/manager/dashboard'}
          className="navbar-logo stylish-logo"
        >
          Attendance<span>Pro</span>
        </Link>

        {/* Menu */}
        <div className="navbar-menu stylish-menu">
          {isEmployee && (
            <>
              <Link to="/employee/dashboard" className="navbar-link stylish-link">Dashboard</Link>
              <Link to="/employee/mark-attendance" className="navbar-link stylish-link">Mark Attendance</Link>
              <Link to="/employee/history" className="navbar-link stylish-link">History</Link>
              <Link to="/employee/profile" className="navbar-link stylish-link">Profile</Link>
            </>
          )}

          {isManager && (
            <>
              <Link to="/manager/dashboard" className="navbar-link stylish-link">Dashboard</Link>
              <Link to="/manager/attendance" className="navbar-link stylish-link">All Attendance</Link>
              <Link to="/manager/calendar" className="navbar-link stylish-link">Calendar</Link>
              <Link to="/manager/reports" className="navbar-link stylish-link">Reports</Link>
            </>
          )}

          {/* User Dropdown */}
          <div
            className="user-dropdown-wrapper"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {/* Avatar */}
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown */}
            {open && (
              <div className="user-dropdown">
                <p className="dropdown-name">{user?.name}</p>
                <span className="dropdown-role">{user?.role}</span>

                <button className="dropdown-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
