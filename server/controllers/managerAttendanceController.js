import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import json2csv from "json2csv";

/* Get all attendance records */
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({}, "-__v -createdAt -updatedAt")
      .populate("userId", "name email employeeId department role")
      .sort({ date: -1 });

    const data = attendance
      .filter(a => a.userId?.role === "employee")
      .map(a => ({
        employee: a.userId?.name,
        email: a.userId?.email,
        employeeId: a.userId?.employeeId,
        department: a.userId?.department,
        date: a.date,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        status: a.status,
        totalHours: a.totalHours
      }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Get attendance of a single employee */
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const records = await Attendance.find(
      { userId: id },
      "-__v -createdAt -updatedAt"
    ).sort({ date: -1 });

    const data = records.map(r => ({
      date: r.date,
      checkInTime: r.checkInTime,
      checkOutTime: r.checkOutTime,
      status: r.status,
      totalHours: r.totalHours
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Dashboard summary for manager */
export const getTeamSummary = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("_id");
    const employeeIds = employees.map(e => e._id);

    const today = new Date().setHours(0, 0, 0, 0);

    const presentToday = await Attendance.countDocuments({
      userId: { $in: employeeIds },
      date: today,
      status: "present"
    });

    const lateToday = await Attendance.countDocuments({
      userId: { $in: employeeIds },
      date: today,
      status: "late"
    });

    const absentToday = employeeIds.length - (presentToday + lateToday);

    res.json({
      totalEmployees: employeeIds.length,
      presentToday,
      lateToday,
      absentToday
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Today's attendance list */
export const getTodayTeamStatus = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("_id");
    const employeeIds = employees.map(e => e._id);

    const today = new Date().setHours(0, 0, 0, 0);

    const records = await Attendance.find(
      { userId: { $in: employeeIds }, date: today },
      "-__v -createdAt -updatedAt"
    )
      .populate("userId", "name email employeeId department")
      .sort({ checkInTime: 1 });

    const data = records.map(r => ({
      employee: r.userId?.name,
      employeeId: r.userId?.employeeId,
      department: r.userId?.department,
      checkInTime: r.checkInTime,
      checkOutTime: r.checkOutTime,
      status: r.status,
      totalHours: r.totalHours
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Export all attendance to CSV */
export const exportAttendanceCSV = async (req, res) => {
  try {
    const records = await Attendance.find({}, "-__v -createdAt -updatedAt")
      .populate("userId", "name email employeeId department role");

    const data = records
      .filter(r => r.userId?.role === "employee")
      .map(r => ({
        employee: r.userId?.name,
        email: r.userId?.email,
        employeeId: r.userId?.employeeId,
        department: r.userId?.department,
        date: r.date,
        checkInTime: r.checkInTime,
        checkOutTime: r.checkOutTime,
        status: r.status,
        totalHours: r.totalHours
      }));

    const csvParser = new json2csv.Parser();
    const csvData = csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_report.csv");
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
