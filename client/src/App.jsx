import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust the path as necessary
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MentorDashboard from "./pages/MentorDashboard";
import AdminPanel from "./pages/AdminPanel";
import RegisterMentor from "./pages/RegisterMentor";
import CourseDetails from "./pages/CourseDetails";
import Payment from "./pages/Payment";
import PaymentTest from "./pages/PaymentTest";
import Translator from "./pages/Translator";
import EntryTestPage from "./pages/EntryTestPage";
import StartCourse from "./pages/StartCourse";
import Books from "./pages/Ai";
import TimetableAI from "./pages/TimetableAI";
import ChatWidget from "./Components/ChatWidget";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-mentor" element={<RegisterMentor />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/course/:id/start" element={<StartCourse />} />

          <Route path="/entrytest/:id" element={<EntryTestPage />} />

          {/* <Route path="/payment/:id" element={<Payment />} /> */}
          <Route path="/payment/:courseId/:fee" element={<PaymentTest />} />

          <Route path="/trans" element={<Translator />} />
          <Route path="/ai" element={<Books />} />
          <Route path="/test" element={<Books />} />

          <Route path="/timetable" element={<TimetableAI />} />
        </Routes>
        <ChatWidget />
      </div>
    </>
  );
}

export default App;
