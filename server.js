const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// Routes (will add later)
app.use("/user", require("./routes/user"));
app.use("/donation", require("./routes/donationRoutes"));
app.use("/recevieRequests", require("./routes/receiverRoutes"));
app.use("/volunteer", require("./routes/volunterRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
