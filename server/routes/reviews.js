const express = require('express');
const multer = require('multer');
const path = require('path');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');
const Course = require('../models/Course');
const upload = require('../middleware/multer');

const router = express.Router();



// POST: Add a review
router.post('/:productId/reviews', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { text,rating } = req.body;
    const image = req.file ? req.file.path : null;
    console.log(image);
    
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

    // Ensure product exists
    const product = await Course.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newReview = new Review({ userId, productId, text,rating, image });
    await newReview.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
});

// GET: Fetch all reviews for a product
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate('userId', 'name');
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

module.exports = router;
