const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
const { dbConnection } = require("./config/connect");
const globalerrorHandler = require("./middlewares/globalErrorMiddleware");
const { app, server } = require("./utils/socket");

//routes
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const postRoute = require("./routes/postRoute");
const notificationRoute = require("./routes/notificationRoute");

// const __dirname = path.resolve();

//express aapp

//database connect
dbConnection();

//middlewares
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mout routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/notification", notificationRoute);

app.use(express.static(path.join(__dirname, "client/dist")));
// app.use(express.static(path.join(__dirname, "uploads")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//global error handler
app.use(globalerrorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log("Server started on port 8000");
});

// rejection outside express server
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
