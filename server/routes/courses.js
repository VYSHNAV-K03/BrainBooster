const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const enrollmentModel = require("../models/enrollmentModel");
const Section = require("../models/Section");
const Exam = require("../models/Exam");

// POST route for creating a course
router.post("/", auth, upload.single("logo"), async (req, res) => {
  const { title, description, fee } = req.body;

  console.log(req.body);

  try {
    const newCourse = new Course({
      title,
      description,
      fee,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
      mentor: req.user.userId, // Assuming req.user is set from the auth middleware
    });

    await newCourse.save();

    console.log(newCourse);

    res.json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route for fetching all courses created by the mentor
router.get("/", auth, async (req, res) => {
  console.log("hi mentor course");

  try {
    const courses = await Course.find({ mentor: req.user.userId });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch all courses
router.get("/all", async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses from the database
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/start", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const sections = await Section.find({ course: req.params.id });

    console.log("helloo");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course, sections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// each section have different exam, so pass the section
router.get("/:id/start/exam", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const sections = await Section.find({ course: req.params.id });
    const exam = await Exam.find({
      courseId: req.params.id,
      sectionId: sections[0]._id,
    });

    console.log("helloooooo");
    console.log(exam);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ course, sections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if the user is enrolled in a course
router.get("/enrolled/:courseId", auth, async (req, res) => {
  try {
    const userId = req.user.userId; // The user's ID from the authentication middleware
    const { courseId } = req.params; // The course ID from the URL

    // Check if there's an enrollment record for the user and course
    const enrollment = await enrollmentModel.findOne({ userId, courseId });

    if (!enrollment) {
      return res.json({ enrolled: false }); // User is not enrolled
    }

    // If enrollment exists, return the enrollment status
    res.json({
      enrolled: true,
      status: enrollment.status,
      paymentId: enrollment.paymentId,
    });
  } catch (err) {
    console.error("Failed to check enrollment status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route for delting a course
router.post("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
