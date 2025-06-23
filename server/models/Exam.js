const mongoose = require('mongoose');


// Entry Test Schema
const ExamSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: String, required: true },
      },
    ],
  });
  
  const Exam = mongoose.model('Exam', ExamSchema);

  module.exports = Exam;