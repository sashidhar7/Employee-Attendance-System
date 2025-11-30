import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayStatus, checkIn, checkOut } from '../../store/slices/attendanceSlice';
import Navbar from '../../components/Navbar';
import { format } from 'date-fns';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { todayStatus, isLoading, message, isSuccess } = useSelector(
    (state) => state.attendance
  );

  // Get today's attendance status on mount
  useEffect(() => {
    dispatch(getTodayStatus());
  }, [dispatch]);

  // Refresh after successful check-in / check-out
  useEffect(() => {
    if (isSuccess && message) {
      alert(message);
      dispatch(getTodayStatus());
    }
  }, [isSuccess, message, dispatch]);

  const handleCheckIn = () => {
    if (window.confirm('Are you sure you want to check in?')) {
      dispatch(checkIn());
    }
  };

  const handleCheckOut = () => {
    if (window.confirm('Are you sure you want to check out?')) {
      dispatch(checkOut());
    }
  };

  const currentTime = format(new Date(), 'hh:mm:ss a');
  const currentDate = format(new Date(), 'MMMM dd, yyyy');

  // 🔥 KEY FIX: Show loading until API returns real status
  if (isLoading || todayStatus === null) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="dashboard-header">
            <h1>Mark Attendance</h1>
            <p>{currentDate}</p>
          </div>

          <div className="card attendance-card">
            <div className="loading">Loading attendance status...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Mark Attendance</h1>
          <p>{currentDate}</p>
        </div>

        <div className="attendance-page">
          <div className="card attendance-card">
            <div className="current-time">
              <h2>{currentTime}</h2>
            </div>

            {/* Attendance Status Section */}
            <div className="status-info">
              {todayStatus.checkInTime ? (
                <div className="checked-in-info">
                  <div className="status-badge">
                    <span className="badge badge-success">Checked In</span>
                  </div>

                  <div className="time-details">
                    <p className="time-label">Check In Time:</p>
                    <p className="time-value">
                      {format(new Date(todayStatus.checkInTime), 'hh:mm:ss a')}
                    </p>

                    {todayStatus.checkOutTime && (
                      <>
                        <p className="time-label">Check Out Time:</p>
                        <p className="time-value">
                          {format(new Date(todayStatus.checkOutTime), 'hh:mm:ss a')}
                        </p>

                        <p className="time-label">Total Hours Worked:</p>
                        <p className="time-value hours">
                          {todayStatus.totalHours.toFixed(2)} hours
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="not-checked-in">
                  <div className="status-badge">
                    <span className="badge badge-warning">Not Checked In</span>
                  </div>
                  <p>You haven't checked in today</p>
                </div>
              )}
            </div>

            {/* Check In / Out Buttons */}
            <div className="action-section">
              {!todayStatus.checkInTime ? (
                <button onClick={handleCheckIn} className="btn btn-primary btn-lg">
                  Check In Now
                </button>
              ) : !todayStatus.checkOutTime ? (
                <button onClick={handleCheckOut} className="btn btn-danger btn-lg">
                  Check Out Now
                </button>
              ) : (
                <div className="completed-message">
                  <p>✓ You have completed your attendance for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="card info-card">
            <h3>Attendance Guidelines</h3>
            <ul className="guidelines-list">
              <li>Check in at the start of your workday</li>
              <li>Check out when leaving the office</li>
              <li>You can only check in once per day</li>
              <li>Total hours are automatically calculated</li>
              <li>Late check-ins may be marked accordingly</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAttendance;
