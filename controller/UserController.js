import User from "../model/User.js";
import bcrypt from "bcrypt";
import { generateJWT } from "../utils/generateJWT.js";

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ message: "username or password is not correct" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "username or password is not correct" });
    }

    const token = generateJWT({ userId: user._id });

    return res.status(200).json({ token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function getUserProfile(req, res) {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function updateUserProfile(req, res) {
  const userId = req.userId;

  const { username, fullname, email, address, phonenumber } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username, fullname, email, address, phonenumber },
      { new: true }
    );
    console.log("this is the user from updateuserProfile", user);

    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function getMe(req, res) {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}

export async function signup(req, res) {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return res.status(409).json({ message: "Something went wrong!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role ? role : "user",
    });

    await user.save();

    const token = generateJWT({ userId: user._id });

    return res.status(200).json({ token, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
}
