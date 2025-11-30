import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { format } from "date-fns";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-container">
          <div className="card profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2>{user?.name}</h2>
              <span className={`badge badge-${user?.role}`}>{user?.role}</span>
            </div>

            <div className="profile-details">
              <div className="profile-item">
                <label>Employee ID</label>
                <p>{user?.employeeId}</p>
              </div>

              <div className="profile-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>

              <div className="profile-item">
                <label>Department</label>
                <p>{user?.department}</p>
              </div>

              <div className="profile-item">
                <label>Role</label>
                <p className="capitalize">{user?.role}</p>
              </div>

              <div className="profile-item">
                <label>Joined On</label>
                <p>
                  {user?.createdAt
                    ? format(new Date(user.createdAt), "MMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="card info-card">
            <h3>Account Information</h3>
            <p>
              This is your employee profile. If you need to update any
              information, please contact your administrator.
            </p>
            <div className="profile-status-card">
              <div>
                <h4>Status</h4>
                <p className="status-text">Active</p>
              </div>
              <div>
                <h4>Account Type</h4>
                <p className="status-text capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
