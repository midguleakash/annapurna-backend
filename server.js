const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();



const app = express();


app.use(cors({
  origin: "*", // for development
}));




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// DB
connectDB();

/**
 * HEALTH CHECK API
 * Used to keep Render server awake
 */
app.get("/ping", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Annapurna backend is alive",
    time: new Date()
  });
});

/**
 * Root API
 */


app.get("/", (req, res) => {
  res.send("Annapurna backend is running");
});

// Routes (will add later)
app.use("/user", require("./routes/user"));
app.use("/donation", require("./routes/donationRoutes"));
app.use("/recevieRequests", require("./routes/receiverRoutes"));
app.use("/volunteer", require("./routes/volunterRoutes"));
app.use("/ai", require("./routes/aiRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
