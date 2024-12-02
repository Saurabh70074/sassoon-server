const mongoose = require('mongoose');

// Schema for Contact Details


// Schema for Booking
const bookingSchema = new mongoose.Schema({
  region: { type: String, required: true },
  StripeOrderId: { type: String, required: true },
  CourseTitle: { type: String, required: true },
  CourseDuration: { type: String },
  CoursePrice: { type: String, required: true },
  CourseCity: { type: String, default: 'N/A' },
  CustomerName: { type: String, default: 'N/A' },
  CustomerEmail: { type: String, required: true },
  CustomerBillingAddress: { type: String, required: true },
  CustomerTelephone: { type: String },
  PurchaseDate: { type: String }, 
  DepositeAmount: { type: String },
  Places: { type: String, required: true },
  BookingStatus: { type: Number, default: 1 },
});

module.exports = mongoose.model('Booking', bookingSchema);
