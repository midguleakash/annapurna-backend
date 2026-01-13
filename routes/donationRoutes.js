const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createDonation, getMyDonations , getAllDonations, markDonationDelivered , updateDonationStatus } =
      require("../controllers/donationController");

router.post("/create", auth, createDonation);
router.get("/my", auth, getMyDonations);
router.get("/all", auth, getAllDonations);

module.exports = router;
