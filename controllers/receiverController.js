const ReceiverRequest = require("../models/ReceiverRequest");
const User = require("../models/User");



// CREATE RECEIVER REQUEST
exports.createReceiverRequest = async (req, res) => {
  try {
    const {      
      foodType,
      quantity,      
      location
    } = req.body;

    const receiverId = req.user.id; // from JWT middleware


    // Validation
    if ( !foodType || !quantity ) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const receiver = await User.findById(receiverId);

    const request = new ReceiverRequest({
      receiver: receiverId,
      receiverName:receiver.name,
      receiverPhone: receiver.mobile,
      foodType,
      quantity,
      deliveryAddress: receiver.address,
      location
    });

    await request.save();

    res.status(201).json({
      message: "Receiver request submitted successfully",
      request
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// GET my RECEIVER REQUESTS
exports.getMyReceiverRequests = async (req, res) => {

  const receiverId = req.user.id;


  try {
    const requests = await ReceiverRequest.find({ receiver: receiverId })
      .populate("receiver", "name address mobile")
      .populate("donor", "name address mobile")
      .populate("donation" , "_id")  
      .populate("volunteer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// GET ALL RECEIVER REQUESTS
exports.getAllReceiverRequests = async (req, res) => { 


  try {

    // Only volunteer allowed
    if (req.user.role !== "volunteer") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const requests = await ReceiverRequest.find()
      .populate("receiver", "name address mobile")
      .populate("donor", "name address mobile")
      .populate("donation" , "_id")    
      .populate("volunteer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};



// ASSIGN DONOR TO RECEIVER REQUEST
exports.assignDonor = async (req, res) => {
  try {
    const donorId = req.user.id;

    const request = await ReceiverRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    request.donor = donorId;
    request.status = "Collected";

    await request.save();

    res.status(200).json({
      message: "Donor assigned successfully",
      request
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
