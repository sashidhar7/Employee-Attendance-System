import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance } from '../../store/slices/attendanceSlice';
import Navbar from '../../components/Navbar';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const TeamCalendar = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  const getAttendanceForDate = (date) => {
    return attendance.filter((record) =>
      isSameDay(new Date(record.date), date)
    );
  };



  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateAttendance = selectedDate ? getAttendanceForDate(selectedDate) : [];

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Team Calendar View</h1>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="calendar-container">
            <div className="card">
              <div className="calendar-header">
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <h2>{format(selectedMonth, 'MMMM yyyy')}</h2>
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
                  const records = getAttendanceForDate(day);
                  const presentCount = records.filter(r => r.status === 'present').length;
                  const absentCount = records.filter(r => r.status === 'absent').length;
                  const lateCount = records.filter(r => r.status === 'late').length;

                  return (
                    <div
                      key={day.toString()}
                      className={`calendar-day clickable ${records.length > 0 ? 'has-attendance' : ''} ${
                        selectedDate && isSameDay(selectedDate, day) ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="day-number">{format(day, 'd')}</div>
                      {records.length > 0 && (
                        <div className="day-stats">
                          {presentCount > 0 && (
                            <span className="mini-badge present">{presentCount}P</span>
                          )}
                          {absentCount > 0 && (
                            <span className="mini-badge absent">{absentCount}A</span>
                          )}
                          {lateCount > 0 && (
                            <span className="mini-badge late">{lateCount}L</span>
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

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="card">
                <h2>Attendance for {format(selectedDate, 'MMMM dd, yyyy')}</h2>
                {selectedDateAttendance.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Total Hours</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDateAttendance.map((record) => (
                          <tr key={record._id}>
                            <td>{record.userId?.employeeId || 'N/A'}</td>
                            <td>{record.userId?.name || 'N/A'}</td>
                            <td>{record.userId?.department || 'N/A'}</td>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No attendance records for this date</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TeamCalendar;
