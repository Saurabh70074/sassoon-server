const Booking = require('../models/booking');

const User = require('../models/user');
// Controller function to fetch all bookings
const getAllBookings = async (req, res) => {
  try {
  
    let username = req.user.username;

    let region;
    if (username === "usadmin") {
      region = "us";
    } else if (username === "ukadmin") {
      region = "uk";
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    // Fetch all bookings from the database
    const bookings = await Booking.find({region:region});

    // Send a response with the fetched bookings
    res.status(200).json({
      message: 'All bookings retrieved successfully!',
      data: bookings,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      error: error.message,
    });
  }
};

// Export the function
module.exports = { getAllBookings };
