const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  duration: Number,

  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airline"
  },

  hotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel"
  }],

  transportType: { type: String, enum: ["Sharing", "Private", "VIP"] },

  includedServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],

  departureDate: Date,
  returnDate: Date,

  cancellationPolicy: String,

  isActive: { type: Boolean, default: true },

  // optional geolocation for map searches
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: '2dsphere'
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);