const mongoose = require('mongoose');


// Entry Test Schema
const EntryTestSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: String, required: true },
      },
    ],
  });
  
  const EntryTest = mongoose.model('EntryTest', EntryTestSchema);

  module.exports = EntryTest;