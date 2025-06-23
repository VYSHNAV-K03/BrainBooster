const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Exam = require('../models/Exam');
const UserTestResult = require('../models/UserTestResult');

const router = express.Router();

// Entry Test Schema


// Add question to entry test
router.post('/:courseId', auth, async (req, res) => {
  const { sectionId,question, options, correctOption } = req.body;
  console.log( {sectionId, question, options, correctOption });
  
  try {
    let entryTest = await Exam.findOne({ sectionId,courseId: req.params.courseId });
    
    if (!entryTest) {
      entryTest = new Exam({ sectionId,courseId: req.params.courseId, questions: [] });
    }
    entryTest.questions.push({ question, options, correctOption });
    console.log(entryTest);
    await entryTest.save();
    res.status(201).json({ message: 'Question added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get questions for a course
router.get('/:courseId/:sectionId', auth, async (req, res) => {
  try {
    console.log("helloo");
    
    const entryTest = await Exam.findOne({ sectionId:req.params.sectionId,courseId: req.params.courseId })
    .populate("sectionId", "title");;
    if (!entryTest) {
      return res.status(404).json({ message: 'No entry test found' });
    }
    console.log(entryTest);
    
    res.json({questions:entryTest.questions,sectionId:entryTest.sectionId._id,title:entryTest.sectionId.title});
  } catch (err) {

    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/submit/:courseId', auth, async (req, res) => {
  try {
      const { courseId } = req.params;
      const { answers } = req.body;
      const userId = req.user.userId;

      // Fetch the entry test for the given course
      const entryTest = await Exam.findOne({ courseId });
      if (!entryTest) return res.status(404).json({ message: 'Entry test not found' });

      let correctAnswers = 0;

      // Compare submitted answers with correct answers
      entryTest.questions.forEach((question, index) => {
          if (answers[index] === question.correctOption) {
              correctAnswers++;
          }
      });

      const score = (correctAnswers / entryTest.questions.length) * 100;

      // Save test result (Assuming a UserTestResult model exists to store user scores)
      const UserTestResult = require('../models/UserTestResult');
      await UserTestResult.create({
          userId,
          courseId,
          score,
      });

      res.json({ message: 'Test submitted successfully', score });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/result/:courseId', auth, async (req, res) => {
  try {
      const userId = req.user.userId; // Extract user ID from auth middleware
      const { courseId } = req.params;

      // Find the test result for the given user and course
      const testResult = await UserTestResult.findOne({ userId, courseId }).sort({ createdAt: -1 });;

      if (!testResult) {
          return res.status(404).json({ message: 'Test result not found' });
      }

      res.json({ score: testResult.score});
  } catch (error) {
      console.error('Error fetching test result:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
