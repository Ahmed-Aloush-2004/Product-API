import dotenv from "dotenv";
import express from "express";
import { connectToMongoDb } from "./db/connectToMongoDb.js";
import userRoute from "./route/User.js";
import categoryRoute from "./route/Category.js";
import productRoute from "./route/Product.js";
import imageSliderRoute from "./route/ImageSlider.js";
import brandRoute from "./route/Brand.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors("*"));
app.use("/uploads", express.static("uploads"));
dotenv.config();
connectToMongoDb();
console.log(process.env.PORT);
 
app.use("/api/auth", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/imageSlider", imageSliderRoute);
app.use("/api/brands", brandRoute);

app.listen(process.env.PORT || 5000, () => console.log("Run on 5000 Port"));
