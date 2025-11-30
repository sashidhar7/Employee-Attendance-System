import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendance } from "../../store/slices/attendanceSlice";
import Navbar from "../../components/Navbar";
import { format } from "date-fns";

const AllEmployeesAttendance = () => {
  const dispatch = useDispatch();
  const { attendance, isLoading } = useSelector((state) => state.attendance);
  const [filters, setFilters] = useState({
    employee: "",
    status: "",
    date: "",
  });

  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredAttendance = attendance.filter((record) => {
    let matches = true;

    if (filters.employee) {
      const searchTerm = filters.employee.toLowerCase();
      matches =
        matches &&
        (record.userId?.name?.toLowerCase().includes(searchTerm) ||
          record.userId?.employeeId?.toLowerCase().includes(searchTerm) ||
          record.userId?.email?.toLowerCase().includes(searchTerm));
    }

    if (filters.status) {
      matches = matches && record.status === filters.status;
    }

    if (filters.date) {
      const recordDate = format(new Date(record.date), "yyyy-MM-dd");
      matches = matches && recordDate === filters.date;
    }

    return matches;
  });

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>All Employees Attendance</h1>
        </div>

        {/* Filters */}
        <div className="card filters-card">
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="employee">Search Employee</label>
              <input
                type="text"
                id="employee"
                name="employee"
                value={filters.employee}
                onChange={handleFilterChange}
                placeholder="Name, ID, or Email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <button
                onClick={() =>
                  setFilters({ employee: "", status: "", date: "" })
                }
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card">
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="table-header">
                <h2>Attendance Records</h2>
                <p className="record-count">
                  Showing {filteredAttendance.length} of {attendance.length}{" "}
                  records
                </p>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Total Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance && filteredAttendance.length > 0 ? (
                      filteredAttendance.map((record, index) => (
                        <tr key={index}>
                          <td>{record.employeeId || "N/A"}</td>
                          <td>{record.employee || "N/A"}</td>
                          <td>{record.department || "N/A"}</td>

                          <td>
                            {format(new Date(record.date), "MMM dd, yyyy")}
                          </td>

                          <td>
                            {record.checkInTime
                              ? format(new Date(record.checkInTime), "hh:mm a")
                              : "-"}
                          </td>

                          <td>
                            {record.checkOutTime
                              ? format(new Date(record.checkOutTime), "hh:mm a")
                              : "-"}
                          </td>

                          <td>
                            {record.totalHours
                              ? `${record.totalHours} hrs`
                              : "-"}
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

export default AllEmployeesAttendance;
