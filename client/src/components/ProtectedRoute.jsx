import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login"  replace/>;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user.role === 'employee') {
      return <Navigate to="/employee/dashboard" />;
    } else if (user.role === 'manager') {
      return <Navigate to="/manager/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
