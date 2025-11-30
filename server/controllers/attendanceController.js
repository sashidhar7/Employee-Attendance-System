import Attendance from "../models/Attendance.js";

export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      userId,
      date: today
    });

    if (alreadyMarked && alreadyMarked.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date();

    // Create 11:00 AM cutoff
    const lateCutoff = new Date();
    lateCutoff.setHours(11, 0, 0, 0);

    // Determine initial status
    const status = now > lateCutoff ? "late" : "present";

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: today },
      {
        checkInTime: now,
        status: status
      },
      { new: true, upsert: true }
    );

    return res.json({
      message: status === "late" ? "Checked in (Late)" : "Checked in successfully",
      attendance
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ userId, date: today });

    if (!record || !record.checkInTime) {
      return res.status(400).json({ message: "Check-in not found" });
    }
    if (record.checkOutTime) {
      return res.status(400).json({ message: "Already checked out" });
    }

    const checkOutTime = new Date();

    // Calculate total hours
    const totalHours =
      (checkOutTime - new Date(record.checkInTime)) / (1000 * 60 * 60);

    // Create a 1:30 PM threshold
    const cutoff = new Date();
    cutoff.setHours(13, 30, 0, 0); // 1:30 PM

    let finalStatus = record.status;  // keep late/present initially

    // Half-day rule (overrides everything)
    if (checkOutTime < cutoff) {
      finalStatus = "half-day";
    }

    // Save values
    record.checkOutTime = checkOutTime;
    record.totalHours = Number(totalHours.toFixed(2));
    record.status = finalStatus;

    await record.save();

    return res.json({
      message:
        finalStatus === "half-day"
          ? "Checked out – marked as Half Day"
          : finalStatus === "late"
          ? "Checked out – marked Late"
          : "Checked out successfully",
      record
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Attendance.find({ userId }).sort({ date: -1 });
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const records = await Attendance.find({
      userId,
      date: {
        $gte: new Date(year, month, 1),
        $lte: new Date(year, month + 1, 0)
      }
    });

    const summary = {
      present: records.filter(r => r.status === "present").length,
      absent: records.filter(r => r.status === "absent").length,
      late: records.filter(r => r.status === "late").length,
      halfDay: records.filter(r => r.status === "half-day").length,
      totalHours: records.reduce((sum, r) => sum + (r.totalHours || 0), 0)
    };

    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ userId, date: today });

    return res.json(record || { status: "not-marked" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
