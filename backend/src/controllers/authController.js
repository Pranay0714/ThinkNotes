import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Register User
export async function registerUser(req, res) {
  try {
    const { name, userName, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !userName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Normalize input
    const normalizedUserName = userName.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Check if username already exists
    const existingUserName = await User.findOne({
      userName: normalizedUserName,
    });

    if (existingUserName) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      userName: normalizedUserName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate MongoDB values
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

// Login User
export async function loginUser(req, res) {
  try {
    const { loginId, password } = req.body;

    // Check required fields
    if (!loginId || !password) {
      return res.status(400).json({
        message: "Username/email and password are required",
      });
    }

    // Normalize login input
    const normalizedLoginId = loginId.trim().toLowerCase();

    // Find user using Email OR Username
    const user = await User.findOne({
      $or: [
        { email: normalizedLoginId },
        { userName: normalizedLoginId },
      ],
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid username/email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username/email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}