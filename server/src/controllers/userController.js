import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function sanitizeUser(user) {
  return user.toJSON();
}

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: users.length,
    data: users.map(sanitizeUser),
  });
});

export const getUserByEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: sanitizeUser(user),
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error("A user with this email address already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "user",
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: sanitizeUser(user),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Incorrect password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: sanitizeUser(user),
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Role must be either 'user' or 'admin'");
  }

  const user = await User.findOneAndUpdate(
    { email: req.params.email.toLowerCase() },
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: sanitizeUser(user),
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete({
    email: req.params.email.toLowerCase(),
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
