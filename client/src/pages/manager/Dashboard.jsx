import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerDashboard } from '../../store/slices/attendanceSlice';
import Navbar from '../../components/Navbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, isLoading } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

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

  const {
    totalEmployees = 0,
    presentToday = 0,
    absentToday = 0,
    weeklyTrend = [],
    departmentWise = [],
  } = dashboard;

  const COLORS = ['#10b981', '#ef4444'];

  const attendanceData = [
    { name: 'Present', value: presentToday },
    { name: 'Absent', value: absentToday }
  ];

  return (
    <>
      <Navbar />
      <div className="container">

        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="stats-container">

          <div className="stat-card">
            <div className="stat-icon employees"></div>
            <div className="stat-info">
              <h3>Total Employees</h3>
              <p className="stat-number">{totalEmployees}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon present"></div>
            <div className="stat-info">
              <h3>Present Today</h3>
              <p className="stat-number">{presentToday}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon absent"></div>
            <div className="stat-info">
              <h3>Absent Today</h3>
              <p className="stat-number">{absentToday}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon percentage"></div>
            <div className="stat-info">
              <h3>Attendance Rate</h3>
              <p className="stat-number">
                {totalEmployees > 0
                  ? ((presentToday / totalEmployees) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>

        </div>

        {/* ============ CHARTS ============ */}
        <div className="chart-grid">

          <div className="card chart-card">
            <h2>Today's Attendance Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {weeklyTrend.length > 0 && (
            <div className="card chart-card">
              <h2>Weekly Attendance Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="_id"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {departmentWise.length > 0 && (
            <div className="card chart-card">
              <h2>Department-wise Attendance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentWise}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
