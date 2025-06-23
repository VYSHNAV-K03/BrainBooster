const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  materials: [
    {
      type: { type: String, enum: ['video', 'pdf'], required: true },
      url: { type: String, required: true }
    }
  ]
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
