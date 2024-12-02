const { listAllCustomers } = require('../services/stripeService');
const Booking = require('../models/booking');

// Controller function
const fetchAndStoreAllCustomers = async (req, res) => {
  try {
    // Fetch all customers along with their payment intent details
    const customers = await listAllCustomers();

    // Map over customers to create bookings array
    const bookings = customers.map((customer) => ({
      region: customer.region,
      StripeOrderId: customer.stripeId,
      CourseTitle: customer.title || 'N/A',
      CourseDuration: customer.CourseDuration,
      CoursePrice: customer.price || 'N/A', 
      CourseCity: customer.CourseCity || 'N/A',
      CustomerEmail: customer.customerName || 'N/A',
      CustomerBillingAddress: customer.CustomerBillingAddress,
      CustomerTelephone: customer.CustomerTelephone,
      PurchaseDate: customer.PurchaseDate || 'N/A',
      DepositeAmount: customer.DepositeAmount,
      Places: customer.Places,
      BookingStatus: customer.BookingStatus
    }));

    // Save all bookings to the MongoDB database
    await Booking.insertMany(bookings);

    // Send success response
    res.status(200).json({
      message: 'All customers fetched and stored successfully!',
      data: bookings,
    });
  } catch (error) {
    // Handle errors and send an error response
    res.status(500).json({
      error: error.message,
    });
  }
};

// Export the function
module.exports = { fetchAndStoreAllCustomers };
