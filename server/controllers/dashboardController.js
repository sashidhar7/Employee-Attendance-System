import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// Employee Dashboard API
export const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date().setHours(0, 0, 0, 0);

    // Today status
    const todayRecord = await Attendance.findOne({ userId, date: today });

    // Monthly summary
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const records = await Attendance.find({
      userId,
      date: {
        $gte: new Date(year, month, 1),
        $lte: new Date(year, month + 1, 0)
      }
    }).sort({ date: -1 });

    const summary = {
      present: records.filter(r => r.status === "present").length,
      absent: records.filter(r => r.status === "absent").length,
      late: records.filter(r => r.status === "late").length,
      totalHours: records.reduce((sum, r) => sum + (r.totalHours || 0), 0),
    };

    // Last 7 days
    const last7 = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      todayStatus: todayRecord ? todayRecord.status : "not-marked",
      todayRecord,
      summary,
      recent: last7
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager Dashboard API
export const getManagerDashboard = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });

    const totalEmployees = employees.length;

    const today = new Date().setHours(0, 0, 0, 0);

    const todayPresent = await Attendance.countDocuments({
      date: today,
      checkInTime: { $exists: true },
    });

    const absentToday = totalEmployees - todayPresent;

    // Weekly trend (last 7 days)
    const last7 = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: "$date",
          present: { $sum: { $cond: [{ $ifNull: ["$checkInTime", false] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Department-wise attendance
    const deptSummary = await Attendance.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.department",
          present: { $sum: { $cond: [{ $ifNull: ["$checkInTime", false] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      totalEmployees,
      presentToday: todayPresent,
      absentToday,
      weeklyTrend: last7,
      departmentWise: deptSummary,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
