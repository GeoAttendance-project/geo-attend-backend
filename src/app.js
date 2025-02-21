import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors"
import bodyParser from "body-parser";
dotenv.config();
import errorController from "./controllers/error/errorController.js"
import studentRouter from "./routes/student/studentRoutes.js";
import adminRouter from "./routes/admin/adminRoutes.js"

const PORT = process.env.PORT || 3000;
const app = express();
const allowedOrigins = ['http://localhost:5173','http://192.168.142.25:5173'];

app.use(cors({
  origin: function (origin, callback) {
    console.log(origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected!'));
  
app.use(morgan("dev"))
app.use(bodyParser.json())
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to geo fence attendance",
  });
});

app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorController)
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
