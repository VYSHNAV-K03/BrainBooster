import React, { useState } from "react";
import { NeuralNetwork } from "brain.js";
import "bootstrap/dist/css/bootstrap.min.css";

const TimetableAI = () => {
    const [classTime, setClassTime] = useState([]);
    const [freeTime, setFreeTime] = useState([]);
    const [studyGoals, setStudyGoals] = useState("");
    const [timetable, setTimetable] = useState("");
    const [newClass, setNewClass] = useState({ start: "", end: "" });
    const [newFree, setNewFree] = useState({ start: "", end: "" });

    const addClassTime = () => {
        if (newClass.start && newClass.end) {
            setClassTime([...classTime, { start: newClass.start, end: newClass.end }]);
            setNewClass({ start: "", end: "" });
        }
    };

    const addFreeTime = () => {
        if (newFree.start && newFree.end) {
            setFreeTime([...freeTime, { start: newFree.start, end: newFree.end }]);
            setNewFree({ start: "", end: "" });
        }
    };

    const generateTimetable = () => {
        if (!freeTime.length) {
            setTimetable("⚠️ Please add free time slots.");
            return;
        }

        // AI Model Setup
        const net = new NeuralNetwork();
        net.train([
            { input: { morning: 1, afternoon: 0 }, output: { best: 1 } }, // Morning is best
            { input: { morning: 0, afternoon: 1 }, output: { best: 0.8 } }, // Afternoon is okay
            { input: { morning: 0, afternoon: 0 }, output: { best: 0.2 } } // Night is least effective
        ]);

        // Generate Study Plan
        let studyPlan = "";
        freeTime.forEach((slot, index) => {
            const input = { morning: slot.start < "12:00" ? 1 : 0, afternoon: slot.start >= "12:00" ? 1 : 0 };
            const output = net.run(input);
            studyPlan += `📖 Study Slot ${index + 1}: ${slot.start} - ${slot.end} (Effectiveness: ${(output.best * 100).toFixed(1)}%)\n`;
        });

        setTimetable(studyPlan);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">📅 AI Study Timetable (No API!)</h2>

                <div className="mb-3">
                    <h5>📌 Add Class Timings:</h5>
                    <div className="input-group mb-2">
                        <input
                            type="time"
                            className="form-control"
                            value={newClass.start}
                            onChange={(e) => setNewClass({ ...newClass, start: e.target.value })}
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={newClass.end}
                            onChange={(e) => setNewClass({ ...newClass, end: e.target.value })}
                        />
                        <button className="btn btn-danger" onClick={addClassTime}>➕ Add</button>
                    </div>
                    <ul>
                        {classTime.map((time, index) => (
                            <li key={index}>⏳ {time.start} - {time.end}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-3">
                    <h5>✅ Add Free Time Slots:</h5>
                    <div className="input-group mb-2">
                        <input
                            type="time"
                            className="form-control"
                            value={newFree.start}
                            onChange={(e) => setNewFree({ ...newFree, start: e.target.value })}
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={newFree.end}
                            onChange={(e) => setNewFree({ ...newFree, end: e.target.value })}
                        />
                        <button className="btn btn-success" onClick={addFreeTime}>➕ Add</button>
                    </div>
                    <ul>
                        {freeTime.map((time, index) => (
                            <li key={index}>🕒 {time.start} - {time.end}</li>
                        ))}
                    </ul>
                </div>

                <button className="btn btn-primary w-100" onClick={generateTimetable}>
                    📊 Generate AI Timetable (Offline)
                </button>

                {timetable && (
                    <div className="mt-4">
                        <h4>📝 AI Recommended Study Timetable:</h4>
                        <pre className="bg-light p-3">{timetable}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimetableAI;
