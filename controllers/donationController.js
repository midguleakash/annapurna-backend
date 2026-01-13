const Donation = require("../models/Donation");
const User = require("../models/User");

// CREATE DONATION
exports.createDonation = async (req, res) => {
  try {
    const {
      foodType,
      quantity,      
      location
    } = req.body;

    const donorId = req.user.id; // from JWT middleware

    // Validation
    if (!foodType || !quantity ) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const donor = await User.findById(donorId);

    const donation = new Donation({
      donor: donorId,
      donorName: donor.name,
      donorPhone: donor.mobile,
      foodType,
      quantity,
      pickupAddress: donor.address,
      location
    });

    await donation.save();

    res.status(201).json({
      message: "Donation created successfully",
      donation
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// GET donor DONATIONS
exports.getMyDonations = async (req, res) => {
  try {
    const donorId = req.user.id;

    const donations = await Donation.find({ donor: donorId })
      .populate("donor", "name address mobile ")
      .populate("receiver", "name address mobile ")
      .populate("receiverRequest")  
      .populate("volunteer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL DONATIONS (FOR VOLUNTEER)
exports.getAllDonations = async (req, res) => {
  try {
    // Only volunteer allowed
    if (req.user.role !== "volunteer") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const donations = await Donation.find()
      .populate("donor", "name address mobile")
      .populate("receiver", "name address mobile")
      .populate("receiverRequest")  
      .populate("volunteer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(donations);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};



// UPDATE DONATION STATUS
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    donation.status = status;
    await donation.save();

    res.status(200).json({
      message: "Donation status updated",
      donation
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};



// MARK DONATION AS DELIVERED & ASSIGN RECEIVER
exports.markDonationDelivered = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const donationId = req.params.id;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required"
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    // Prevent duplicate delivery
    if (donation.status === "Delivered") {
      return res.status(400).json({
        message: "Donation already delivered"
      });
    }

    donation.status = "Delivered";
    donation.receiver = receiverId;

    await donation.save();

    res.status(200).json({
      message: "Donation delivered successfully",
      donation
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

