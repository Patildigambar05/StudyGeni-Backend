import User from "../model/UserModel.js";
import { generateToken } from "../utils/jwt.js";


export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if ((!username|| !email|| !password)) {
      return res.status(400).json({
        message: "All fields are required!!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User alredy exists!!",
      });
    }

    const newUser = await User.create({ username, email, password, role });
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      message: `New ${newUser.role} created successfully!!`,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Signup Error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required!!",
      });
    }

    const currentUser = await User.findOne({ email }).select("+password");
    if (!currentUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await currentUser.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password, the password does not match",
      });
    }

    const token = generateToken(currentUser._id, currentUser.role);
    res.status(201).json({
      success: true,
      message: `Heyy ${currentUser.username}, you have logged in as ${currentUser.role}`,
      token,
      user: {
        id: currentUser._id,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
      },
    });
  } catch (error) {
    console.log("Login Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
