const mongoose = require('mongoose');

const UserTestResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    score: { type: Number, required: true }, // Test score in percentage
    createdAt: { type: Date, default: Date.now }
});

const UserTestResult = mongoose.model('UserTestResult', UserTestResultSchema);

module.exports = UserTestResult;
