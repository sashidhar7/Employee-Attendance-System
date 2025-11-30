import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeDashboard, checkIn, checkOut } from '../../store/slices/attendanceSlice';
import Navbar from '../../components/Navbar';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, isLoading, message } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEmployeeDashboard());
  }, [dispatch]);

  const handleCheckIn = () => {
    if (window.confirm('Are you sure you want to check in?')) {
      dispatch(checkIn()).then(() => dispatch(getEmployeeDashboard()));
    }
  };

  const handleCheckOut = () => {
    if (window.confirm('Are you sure you want to check out?')) {
      dispatch(checkOut()).then(() => dispatch(getEmployeeDashboard()));
    }
  };

  if (isLoading || !dashboard) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  const { todayRecord, summary, recent } = dashboard;

  return (
    <>
      <Navbar />
      <div className="container">

        <div className="dashboard-header">
          <h1>Employee Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {/* ✅ Show today's message ONLY if user has checked in today */}
        {todayRecord?.checkInTime && message && (
          <div className="alert">{message}</div>
        )}

        {/* ================= TODAY'S STATUS CARD ================= */}
        <div className="card-grid">
          <div className="card status-card">
            <h2>Today's Status</h2>

            <div className="status-badge">
              {todayRecord?.checkInTime ? (
                <span className="badge badge-success">Checked In</span>
              ) : (
                <span className="badge badge-warning">Not Checked In</span>
              )}
            </div>

            {/* Show times only if checked in */}
            {todayRecord?.checkInTime && (
              <div className="time-info">
                <p>Check In: {format(new Date(todayRecord.checkInTime), 'hh:mm a')}</p>

                {todayRecord.checkOutTime && (
                  <p>Check Out: {format(new Date(todayRecord.checkOutTime), 'hh:mm a')}</p>
                )}

                {todayRecord.totalHours > 0 && (
                  <p>Total Hours: {todayRecord.totalHours.toFixed(2)} hrs</p>
                )}
              </div>
            )}

            {/* Check In / Check Out Buttons */}
            <div className="action-buttons">
              {!todayRecord?.checkInTime ? (
                <button onClick={handleCheckIn} className="btn btn-primary">
                  Check In
                </button>
              ) : !todayRecord?.checkOutTime ? (
                <button onClick={handleCheckOut} className="btn btn-danger">
                  Check Out
                </button>
              ) : (
                <p className="completed-text">Completed for today</p>
              )}
            </div>
          </div>

          {/* ================= MONTHLY SUMMARY CARD ================= */}
          <div className="card summary-card">
            <h2>This Month Summary</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value present">{summary.present}</div>
                <div className="stat-label">Present</div>
              </div>
              <div className="stat-item">
                <div className="stat-value absent">{summary.absent}</div>
                <div className="stat-label">Absent</div>
              </div>
              <div className="stat-item">
                <div className="stat-value late">{summary.late}</div>
                <div className="stat-label">Late</div>
              </div>
              <div className="stat-item">
                <div className="stat-value hours">{summary.totalHours.toFixed(1)}</div>
                <div className="stat-label">Total Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RECENT ATTENDANCE ================= */}
        <div className="card">
          <h2>Recent Attendance (Last 7 Days)</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent?.length > 0 ? (
                  recent.map((record) => (
                    <tr key={record._id}>
                      <td>{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                      <td>
                        {record.checkInTime
                          ? format(new Date(record.checkInTime), 'hh:mm a')
                          : '-'}
                      </td>
                      <td>
                        {record.checkOutTime
                          ? format(new Date(record.checkOutTime), 'hh:mm a')
                          : '-'}
                      </td>
                      <td>
                        {record.totalHours
                          ? `${record.totalHours.toFixed(2)} hrs`
                          : '-'}
                      </td>
                      <td>
                        <span className={`badge badge-${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No recent attendance records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
