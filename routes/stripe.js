const express = require('express');
const { fetchAndStoreAllCustomers } = require('../controllers/stripeController'); // Ensure the path is correct
const { getAllBookings } = require('../controllers/bookingController');
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const courseController = require('../controllers/courseController');

const router = express.Router();

// Define the route and attach the callback
router.get('/customers',authMiddleware, fetchAndStoreAllCustomers);
router.post('/bookings',authMiddleware, getAllBookings);
// Public routes
router.post("/login", authController.login);

router.get('/courses/:courseid',authMiddleware, courseController.getCourseById);

// POST route to add a new course
router.post('/courses', courseController.addCourse);
router.get('/allcourses', courseController.getCourse);

router.put('/coursesupdate/:courseId', courseController.updatecourse);
router.patch('/dateupdate/:dateId', courseController.updatedate);

module.exports = router;





