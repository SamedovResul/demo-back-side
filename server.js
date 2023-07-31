import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import lessonRoutes from "./routes/lessonRotes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import demoSmtpRouter from "./routes/demoSmtpRoutes.js";
import { createNotificationForBirthday } from "./controllers/notificationController.js";

import cron from "node-cron";

dotenv.config();

const app = express();
const port = process.env.PORT;
const uri = process.env.DB_URI;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "15mb" }));
app.use("/api/user/auth", authRoutes);
app.use("/api/user/student", studentRoutes);
app.use("/api/user/teacher", teacherRoutes);
app.use("/api/user/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lesson", lessonRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/user/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/demo", demoSmtpRouter);

app.get("/", (req, res) => {
  res.send("salam");
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected database");
    app.listen(port, () => {
      console.log(`listen server at ${port}`);
      cron.schedule("0 9 * * *", () => {
        createNotificationForBirthday();
      });
    });
  })
  .catch((err) => console.log(err));
