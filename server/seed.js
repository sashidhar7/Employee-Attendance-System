import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Attendance from './models/Attendance.js';

dotenv.config();

// Validate env
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in .env file");
  process.exit(1);
}

// Connect DB (Mongoose v7+ compatible)
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log("🧹 Old data cleared");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Manager
    const manager = await User.create({
      name: "John Manager",
      email: "manager@example.com",
      password: hashedPassword,
      role: "manager",
      employeeId: "MGR001",
      department: "Management",
    });

    console.log(`👨‍💼 Manager created: ${manager.email}`);

    // Create Employees
    const employees = await User.create([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: hashedPassword,
        role: "employee",
        employeeId: "EMP001",
        department: "Engineering",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        password: hashedPassword,
        role: "employee",
        employeeId: "EMP002",
        department: "Engineering",
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: hashedPassword,
        role: "employee",
        employeeId: "EMP003",
        department: "Marketing",
      },
      {
        name: "Diana Prince",
        email: "diana@example.com",
        password: hashedPassword,
        role: "employee",
        employeeId: "EMP004",
        department: "Sales",
      },
      {
        name: "Eve Williams",
        email: "eve@example.com",
        password: hashedPassword,
        role: "employee",
        employeeId: "EMP005",
        department: "HR",
      },
    ]);

    console.log(`👨‍🔧 Employees created: ${employees.length}`);

    // Generate Attendance (last 30 days)
    const attendanceRecords = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      for (const emp of employees) {
        const rand = Math.random();
        let status, checkInTime, checkOutTime, totalHours;

        if (rand > 0.95) {
          // Absent
          status = "absent";
          checkInTime = null;
          checkOutTime = null;
          totalHours = 0;
        } else if (rand > 0.90) {
          // Late
          status = "late";
          checkInTime = new Date(date);
          checkInTime.setHours(10, Math.floor(Math.random() * 60));

          checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(18, Math.floor(Math.random() * 60));

          totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        } else {
          // Present
          status = "present";
          checkInTime = new Date(date);
          checkInTime.setHours(9, Math.floor(Math.random() * 30));

          checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));

          totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        }

        attendanceRecords.push({
          userId: emp._id,
          date,
          checkInTime,
          checkOutTime,
          status,
          totalHours: totalHours ? parseFloat(totalHours.toFixed(2)) : 0,
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`📅 Attendance records inserted: ${attendanceRecords.length}`);

    // Summary to display
    console.log("\n======= SEED COMPLETED =======");
    console.log("👨‍💼 Manager Login:");
    console.log("  Email: manager@example.com");
    console.log("  Password: password123\n");

    console.log("👨‍🔧 Employee Login Accounts:");
    employees.forEach((e) => {
      console.log(`  ${e.name} - ${e.email} - Password: password123`);
    });
    console.log("================================\n");

    process.exit(0);

  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
