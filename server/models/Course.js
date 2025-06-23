const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fee: { type: Number, required: true },
  logo: String, // URL for the uploaded image
  isVerified: {
    type: Boolean,
    default: false,
  },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The mentor who created the course
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }], // Array of sections
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
