// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");

// Route to fetch all mentors (verified or unverified)
router.get("/mentors", async (req, res) => {
  const token = req.header("x-auth-token");

  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id);

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    // Find all mentors (verified or unverified)
    const mentors = await User.find({ role: "mentor" });
    res.json(mentors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// backend/routes/admin.js
// Route to verify or unverify a mentor
router.put("/mentors/:id/verify", async (req, res) => {
  const token = req.header("x-auth-token");
  const { isVerified } = req.body; // The new verification status

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    // Update the mentor's verification status
    const mentor = await User.findById(req.params.id);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.isVerified = isVerified;
    await mentor.save();

    res.json({
      message: `Mentor ${isVerified ? "verified" : "unverified"} successfully`,
      mentor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find() // Fetch all courses from the database
      .populate("mentor", "name");
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/courses/:id/verify", async (req, res) => {
  const { isVerified } = req.body;
  try {
    const courses = await Course.findById(req.params.id); // Fetch all courses from the database

    courses.isVerified = isVerified;
    await courses.save();

    res.json({
      message: `Course ${isVerified ? "verified" : "unverified"} successfully`,
      courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

module.exports = router;
