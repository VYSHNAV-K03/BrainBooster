const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
const Course = require('../models/Course'); // Course model
const Enrollment = require('../models/enrollmentModel'); // Enrollment model
const auth = require('../middleware/auth');

dotenv.config();

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create a payment order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency || 'INR',
    receipt: `receipt_order_${Math.random().toString(36).substring(2)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: 'Order creation failed', error });
  }
});



// Route to verify payment
router.post('/verify-payment',auth, async (req, res) => {

 

  try {
    // Step 1: Save enrollment details in the database
    const newEnrollment = new Enrollment({
      userId: req.user.userId, // Authenticated user ID
      courseId: req.body.courseId,
      amountPaid: req.body.amount,
      status: 'Paid',
      createdAt: new Date(),
    });

    await newEnrollment.save();

    // Step 2: Update the enrolled students count in the course
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.enrolledStudents += 1;
    await course.save();

    console.log("Payment verified and enrollment saved:", newEnrollment);

    res.status(200).json({ success: true, message: 'Payment verified and enrollment successful.' });
  } catch (error) {
    console.error("Error during enrollment:", error);
    res.status(500).json({ success: false, message: 'Enrollment saving failed.', error });
  }
});

module.exports = router;
