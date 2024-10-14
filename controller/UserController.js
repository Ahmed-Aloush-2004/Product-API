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

    const isPassworCorrct = await bcrypt.compare(password, user.password);

    if (!isPassworCorrct) {
      return res
        .status(400)
        .json({ message: "username or password is not correct" });
    }

    const token = generateJWT({ id: user._id });

    return res.status(200).json({ token });
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
    const existUser = await User.findOne({ username, email });

    if (existUser) {
      return res.status(409).json({ message: "Something went wrong!" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = generateJWT({ id: newUser._id });

    return res.status(200).json({ token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }

  
}
