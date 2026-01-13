const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { matchDonation , getMyMatchHistory, getAllMatchHistory, markDelivered  } = require("../controllers/volunteerController");

// ONLY volunteer
router.post("/match", auth, matchDonation);

router.get("/matches/my", auth, getMyMatchHistory);
router.get("/matches/all", auth, getAllMatchHistory);
router.post("/matches/:id/deliver", auth, markDelivered);

module.exports = router;