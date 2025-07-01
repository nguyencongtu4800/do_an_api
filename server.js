require("dotenv").config();
const bodyParser=require("body-parser")
const express = require("express");
const mongoose = require("mongoose");

const classRoutes      = require("./routes/classRouter");
const scheduleRoutes   = require("./routes/scheduleRouter");
const attendanceRoutes = require("./routes/attendanceRouter");
const studentRoutes    = require("./routes/studentRouter");



mongoose.set('strictQuery', false);
//express app created
const app = express();
const server = require("http").createServer(app);


const io = require("socket.io")(server, {
  cors: {
    origin: "*", 
  },
});


const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, 
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); 

//middle vware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


app.use("/class",classRoutes);
app.use("/schedule",scheduleRoutes);
app.use("/attendance",attendanceRoutes);
app.use("/student",studentRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
