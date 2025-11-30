import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAttendance,
  exportCSV,
} from "../../store/slices/attendanceSlice";
import Navbar from "../../components/Navbar";
import { format } from "date-fns";

const Reports = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const handleExport = () => {
    dispatch(exportCSV());
  };

  // Get unique employees
  const employees = Array.from(
    new Map(
      attendance
        .filter((record) => record.userId)
        .map((record) => [record.userId._id, record.userId])
    ).values()
  );

  // Filter attendance based on date range and employee
  const filteredAttendance = attendance.filter((record) => {
    let matches = true;

    if (dateRange.startDate) {
      matches =
        matches && new Date(record.date) >= new Date(dateRange.startDate);
    }

    if (dateRange.endDate) {
      matches = matches && new Date(record.date) <= new Date(dateRange.endDate);
    }

    if (selectedEmployee) {
      matches = matches && record.userId?._id === selectedEmployee;
    }

    return matches;
  });

  // Calculate statistics
  const stats = {
    totalRecords: filteredAttendance.length,
    present: filteredAttendance.filter((r) => r.status === "present").length,
    absent: filteredAttendance.filter((r) => r.status === "absent").length,
    late: filteredAttendance.filter((r) => r.status === "late").length,
    halfDay: filteredAttendance.filter((r) => r.status === "half-day").length,
    totalHours: filteredAttendance.reduce(
      (sum, r) => sum + (r.totalHours || 0),
      0
    ),
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>Attendance Reports</h1>
          <button onClick={handleExport} className="btn btn-primary">
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card filters-card">
          <h2>Filter Reports</h2>
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="employee">Employee</label>
              <select
                id="employee"
                name="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <button
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  setSelectedEmployee("");
                }}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="card">
          <h2>Report Summary</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{stats.totalRecords}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Present</div>
              <div className="stat-value present">{stats.present}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Absent</div>
              <div className="stat-value absent">{stats.absent}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Late</div>
              <div className="stat-value late">{stats.late}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Half Day</div>
              <div className="stat-value half-day">{stats.halfDay}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Hours</div>
              <div className="stat-value">{stats.totalHours.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="card">
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="table-header">
                <h2>Attendance Data</h2>
                <p className="record-count">
                  Showing {filteredAttendance.length} records
                </p>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
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
                    {filteredAttendance && filteredAttendance.length > 0 ? (
                      filteredAttendance.map((record) => (
                        <tr key={record._id}>
                          <td>
                            {format(new Date(record.date), "MMM dd, yyyy")}
                          </td>

                          {/* Employee Details */}
                          <td>{record.userId?.employeeId || "N/A"}</td>
                          <td>{record.userId?.name || "N/A"}</td>
                          <td>{record.userId?.department || "N/A"}</td>

                          {/* Check In */}
                          <td>
                            {record.checkInTime
                              ? format(new Date(record.checkInTime), "hh:mm a")
                              : "0"}
                          </td>

                          {/* Check Out */}
                          <td>
                            {record.checkOutTime
                              ? format(new Date(record.checkOutTime), "hh:mm a")
                              : "0"}
                          </td>

                          {/* Total Hours */}
                          <td>
                            {record.totalHours
                              ? `${record.totalHours.toFixed(2)} hrs`
                              : "0 hrs"}
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
                        <td colSpan="8" className="no-data">
                          No attendance records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;
