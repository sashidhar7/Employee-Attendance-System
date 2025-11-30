import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// helper to create unique employeeId like EMP001
const generateEmployeeId = async () => {
  const last = await User.findOne().sort({ createdAt: -1 }).select("employeeId").lean();
  if (!last || !last.employeeId) return "EMP001";
  const num = parseInt(last.employeeId.replace(/\D/g, "")) + 1;
  return `EMP${String(num).padStart(3, "0")}`;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "employee", employeeId, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check MongoDB connection
    if (!User.db || User.db.readyState !== 1) {
      return res.status(503).json({ message: "Database connection unavailable. Please check MongoDB Atlas IP whitelist." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    let finalEmployeeId = employeeId;
    if (!finalEmployeeId) {
      finalEmployeeId = await generateEmployeeId();
    } else {
      // prevent duplicate provided employeeId
      const existsId = await User.findOne({ employeeId: finalEmployeeId });
      if (existsId) return res.status(400).json({ message: "employeeId already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      employeeId: finalEmployeeId,
      department: department || ""
    });

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        createdAt: user.createdAt
      },
      token
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
 
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    // Check MongoDB connection
    if (!User.db || User.db.readyState !== 1) {
      return res.status(503).json({ message: "Database connection unavailable. Please check MongoDB Atlas IP whitelist." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: user.role });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        department: user.department,
        createdAt: user.createdAt
      },
      token
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMe = async (req, res) => {
  // auth middleware attaches req.user
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    return res.json({ user: req.user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
