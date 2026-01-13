const Donation = require("../models/Donation");
const ReceiverRequest = require("../models/ReceiverRequest");

exports.matchDonation = async (req, res) => {
  try {
    // 🔐 Volunteer only
    if (req.user.role !== "volunteer") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const { donationId, receiverRequestId } = req.body;
    const volunteerId = req.user.id;

    if (!donationId || !receiverRequestId) {
      return res.status(400).json({
        message: "Donation ID and Receiver Request ID are required"
      });
    }

    // Fetch donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    // Fetch receiver request
    const receiverRequest = await ReceiverRequest.findById(receiverRequestId);
    if (!receiverRequest) {
      return res.status(404).json({
        message: "Receiver request not found"
      });
    }

    // 🔒 Status checks
    if (donation.status !== "Pending") {
      return res.status(400).json({
        message: "Donation already matched"
      });
    }

    if (receiverRequest.status !== "Waiting") {
      return res.status(400).json({
        message: "Receiver request already matched"
      });
    }

    // ✅ MATCHING LOGIC

    donation.status = "Collected";
    donation.receiver = receiverRequest.receiver;
    donation.receiverRequest = receiverRequest._id;
    donation.volunteer = volunteerId;

    receiverRequest.status = "Collected";
    receiverRequest.donor = donation.donor;
    receiverRequest.donation = donation._id;
    receiverRequest.volunteer = volunteerId;

    // Save both
    await donation.save();
    await receiverRequest.save();

    res.status(200).json({
      message: "Donation matched successfully",
      donation,
      receiverRequest
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET /volunteer/matches/my
exports.getMyMatchHistory = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const matches = await Donation.find({
      volunteer: req.user.id,
      status: { $ne: "Pending" }
    })
      .populate("donor", "name mobile address")
      .populate("receiver", "name mobile address")
      .populate("volunteer", "name")
      .populate("receiverRequest")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// GET /volunteer/matches/all
exports.getAllMatchHistory = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const matches = await Donation.find({
      status: { $ne: "Pending" }
    })
      .populate("donor", "name mobile address")
      .populate("receiver", "name mobile address")
      .populate("volunteer", "name")
      .populate("receiverRequest")
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// POST /volunteer/matches/:id/deliver
exports.markDelivered = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // 🔐 Only same volunteer can update
    if (String(donation.volunteer) !== req.user.id) {
      return res.status(403).json({ message: "Not your match" });
    }

    // 🔒 Only Collected → Delivered allowed
    if (donation.status !== "Collected") {
      return res.status(400).json({ message: "Already completed" });
    }

    // ✅ Update Donation
    donation.status = "Delivered";
    await donation.save();

    // ✅ Update ReceiverRequest if exists
    if (donation.receiverRequest) {
      await ReceiverRequest.findByIdAndUpdate(
        donation.receiverRequest,
        { status: "Received" }
      );
    }

    res.status(200).json({
      message: "Donation delivered and receiver request marked as received"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

