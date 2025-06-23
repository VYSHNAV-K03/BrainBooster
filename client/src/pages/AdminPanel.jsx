import React, { useState, useEffect } from "react";
import axios from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("mentors"); // State to switch between tabs
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "x-auth-token": token,
    },
  };

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get("/admin/mentors", config);
        setMentors(response.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("/admin/courses", config);
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchMentors();
    fetchCourses();
  }, []);

  const handleVerification = async (id, isVerified, type) => {
    try {
      await axios.put(`/admin/${type}/${id}/verify`, { isVerified }, config);

      if (type === "mentors") {
        setMentors((prev) =>
          prev.map((mentor) =>
            mentor._id === id ? { ...mentor, isVerified } : mentor
          )
        );
      } else {
        setCourses((prev) =>
          prev.map((course) =>
            course._id === id ? { ...course, isVerified } : course
          )
        );
      }
    } catch (err) {
      console.error("Error updating verification status:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header text-center">
          <h2>Admin Panel</h2>
          <ul className="nav nav-tabs mt-3">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "mentors" ? "active" : ""
                }`}
                onClick={() => setActiveTab("mentors")}
              >
                Manage Mentors
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "courses" ? "active" : ""
                }`}
                onClick={() => setActiveTab("courses")}
              >
                Manage Courses
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === "mentors" ? (
            mentors.length > 0 ? (
              <table className="table table-hover table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor) => (
                    <tr key={mentor._id}>
                      <td>{mentor.name}</td>
                      <td>{mentor.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            mentor.isVerified ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {mentor.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn ${
                            mentor.isVerified ? "btn-warning" : "btn-success"
                          } btn-sm`}
                          onClick={() =>
                            handleVerification(
                              mentor._id,
                              !mentor.isVerified,
                              "mentors"
                            )
                          }
                        >
                          {mentor.isVerified ? "Unverify" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-info text-center">
                No mentors available.
              </div>
            )
          ) : courses.length > 0 ? (
            <table className="table table-hover table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>{course.mentor.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          course.isVerified ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {course.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn ${
                          course.isVerified ? "btn-warning" : "btn-success"
                        } btn-sm`}
                        onClick={() =>
                          handleVerification(
                            course._id,
                            !course.isVerified,
                            "courses"
                          )
                        }
                      >
                        {course.isVerified ? "Unverify" : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info text-center">
              No courses available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
