require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const stripeRoutes = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// app.use(cors());

app.use(cors({
  origin:  ['http://localhost:3000', 'https://saurabh70074.github.io'], // Allow this specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow cookies if needed
}));

// Routes
app.use('/api', stripeRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
