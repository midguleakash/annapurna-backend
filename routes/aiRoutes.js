const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const auth = require("../middleware/authMiddleware");

// Suggest best receivers for a donation
router.get(
    "/suggest-receivers/:donationId",
    auth,
    aiController.suggestReceivers
);

// Get all receiver requests with priority
router.get(
    "/receiver-priority",
    auth,
    aiController.getRequestsWithPriority
);

module.exports = router;
