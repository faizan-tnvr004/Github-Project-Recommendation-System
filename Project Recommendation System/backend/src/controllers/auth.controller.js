import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_change_me";

// In-memory store used when MONGO_URI is not set (mock mode)
const mockUsers = new Map();

function isMock() {
  return process.env.USE_MOCK_DATA === "true";
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password." });
    }

    const normalEmail = email.toLowerCase();

    if (isMock()) {
      if (mockUsers.has(normalEmail)) {
        return res.status(400).json({ message: "An account with this email already exists. Please log in." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const id = `mock-${Date.now()}`;
      mockUsers.set(normalEmail, { id, name, email: normalEmail, password: hashedPassword });

      const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(201).json({ token, user: { id, name, email: normalEmail } });
    }

    const existingUser = await User.findOne({ email: normalEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists. Please log in." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email: normalEmail, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const normalEmail = email.toLowerCase();

    if (isMock()) {
      const mockUser = mockUsers.get(normalEmail);
      if (!mockUser) {
        return res.status(400).json({ message: "No account found with this email. Please sign up." });
      }

      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign({ id: mockUser.id }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, user: { id: mockUser.id, name: mockUser.name, email: mockUser.email } });
    }

    const user = await User.findOne({ email: normalEmail });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email. Please sign up." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
