const mongoose = require("mongoose");

const receiverRequestSchema = new mongoose.Schema({

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiverName: {
    type: String,
    required: true
  },

  receiverPhone: {
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

  deliveryAddress: {
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
    enum: ["Waiting", "Collected", "Received"],
    default: "Waiting"
  },

  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
    default: null
  },

  

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("ReceiverRequest", receiverRequestSchema);
