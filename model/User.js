import mongoose from "mongoose";

mongoose.models = {};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      // required: true,
      unique: true,
      default:""
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      // required: true,
      default:""
     
    },
    phonenumber: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
