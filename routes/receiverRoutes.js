const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createReceiverRequest, getMyReceiverRequests , getAllReceiverRequests, assignDonor } =
      require("../controllers/receiverController");

router.post("/create", auth, createReceiverRequest);
router.get("/my", auth, getMyReceiverRequests);
router.get("/all", auth, getAllReceiverRequests);

module.exports = router;
