import dotenv from "dotenv";
import express from "express";
import { connectToMongoDb } from "./db/connectToMongoDb.js";
import userRoute from "./route/User.js";
import categoryRoute from "./route/Category.js";
import productRoute from "./route/Product.js";
const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
dotenv.config();
connectToMongoDb();
console.log(process.env.PORT);

app.use("/api/auth", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);

app.listen(process.env.PORT || 5000, () => console.log("Run on 5000 Port"));
