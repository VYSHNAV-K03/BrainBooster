const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

// GET route for fetching sections of a course
router.get('/:courseId', auth, async (req, res) => {
  try {
    const sections = await Section.find({ course: req.params.courseId });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST route for creating a new section
router.post('/', auth, upload.any(), async (req, res) => {
  const { title,note, courseId } = req.body;
  
  try {
    const newSection = new Section({
      title,
      course: courseId,
      note,
      materials: req.files.map(file => ({
        type: file.mimetype.includes('video') ? 'video' : 'pdf',
        url: `/uploads/${file.filename}`
      }))
    });

    await newSection.save();
    res.json({ message: 'Section created successfully', section: newSection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
