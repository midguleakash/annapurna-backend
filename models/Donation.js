const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({

  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  donorName: {
    type: String,
    required: true
  },

  donorPhone: {
    type: String,
    required: true
  },

  foodType: {
    type: String,
    required: true
  },

  quantity: {
    type: String,
    required: true
  },

  pickupAddress: {
    type: String,
    required: true
  },

  location: {
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    }
  },

  volunteer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

  status: {
    type: String,
    enum: ["Pending", "Collected", "Delivered"],
    default: "Pending"
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

   receiverRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReceiverRequest",
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Donation", donationSchema);
