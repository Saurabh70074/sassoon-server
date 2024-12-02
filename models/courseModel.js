const mongoose = require('mongoose');

// Define the schema for the course data
const courseSchema = new mongoose.Schema({
  courseid: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  dates: [{
    date: { type: String },
    price_with_vat: { type: Number },
    visibility: { type: String },
    practice_option: { type: String },
    places: { type: Number },
    booked_places: { type: Number},
    available_places: { type: Number },
    currency: { type: String },
    deposit_amount: { type: Number},
    price_without_vat: { type: Number }
  }]
});

const Course = mongoose.model('sassoonCourse', courseSchema);

module.exports = Course;
