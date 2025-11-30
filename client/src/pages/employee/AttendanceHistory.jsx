import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyHistory } from '../../store/slices/attendanceSlice';
import Navbar from '../../components/Navbar';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'table'

  useEffect(() => {
    dispatch(getMyHistory());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      present: '#10b981',
      absent: '#ef4444',
      late: '#f59e0b',
      'half-day': '#f97316',
    };
    return colors[status] || '#6b7280';
  };

  const getAttendanceForDate = (date) => {
    return attendance.find((record) =>
      isSameDay(new Date(record.date), date)
    );
  };

  const renderCalendarView = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <button
            onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <h3>{format(selectedMonth, 'MMMM yyyy')}</h3>
          <button
            onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
        
        <div className="calendar-grid">
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>
          
          {/* Empty cells for days before month starts */}
          {Array.from({ length: days[0].getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day empty"></div>
          ))}
          
          {days.map((day) => {
            const record = getAttendanceForDate(day);
            return (
              <div
                key={day.toString()}
                className={`calendar-day ${record ? 'has-attendance' : ''}`}
                style={{
                  backgroundColor: record ? getStatusColor(record.status) + '20' : 'transparent',
                  borderLeft: record ? `4px solid ${getStatusColor(record.status)}` : 'none',
                }}
              >
                <div className="day-number">{format(day, 'd')}</div>
                {record && (
                  <div className="day-info">
                    <span className={`badge badge-${record.status}`}>
                      {record.status}
                    </span>
                    {record.totalHours > 0 && (
                      <span className="hours">{record.totalHours.toFixed(1)}h</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Late</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
            <span>Half Day</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    return (
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
            {attendance && attendance.length > 0 ? (
              attendance.map((record) => (
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
                  <td>{record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}</td>
                  <td>
                    <span className={`badge badge-${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>My Attendance History</h1>
          <div className="view-toggle">
            <button
              className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('calendar')}
            >
              Calendar View
            </button>
            <button
              className={`btn ${view === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('table')}
            >
              Table View
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="card">
            {view === 'calendar' ? renderCalendarView() : renderTableView()}
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceHistory;
