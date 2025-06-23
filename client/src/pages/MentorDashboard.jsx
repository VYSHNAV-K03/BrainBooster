import React, { useState, useEffect } from "react";
import axios from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MentorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false); // Toggle form visibility
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState("");
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [note, setnote] = useState("");
  const [files, setFiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionsSection, setquestionsSection] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: "",
  });

  const [newExamQuestion, setNewExamQuestion] = useState({
    sectionId: "",
    question: "",
    options: ["", "", "", ""],
    correctOption: "",
  });
  const [selectedSection, setSelectedSection] = useState(null);

  console.log(questionsSection);

  const baseURL = "http://localhost:5000";
  const token = localStorage.getItem("token"); // Retrieve mentor's token

  // Fetch courses created by mentor
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const config = {
          headers: {
            "x-auth-token": token,
          },
        };
        const response = await axios.get("/courses", config);
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [token]);

  // Handle course creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("hello");

    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("fee", fee);
    formData.append("logo", logo); // Add the logo file

    try {
      const config = {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      };

      // Make the POST request to create the course
      await axios.post("/courses", formData, config);
      setMessage("Course created successfully");
      setShowCreateForm(false); // Hide form after submission
      // Refresh courses list
      const response = await axios.get("/courses", config);

      setCourses(response.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create course");
    }
  };

  console.log(courses);

  // Fetch sections for a selected course
  useEffect(() => {
    if (selectedCourse) {
      const fetchSections = async () => {
        try {
          const response = await axios.get(`/sections/${selectedCourse._id}`, {
            headers: {
              "x-auth-token": token,
            },
          });
          setSections(response.data);
        } catch (err) {
          console.error("Error fetching sections:", err);
        }
      };

      fetchSections();
    }
  }, [selectedCourse, token]);

  // Handle section creation
  const handleSectionSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newSectionTitle);
    formData.append("note", note);
    formData.append("courseId", selectedCourse._id);
    files.forEach((file) => formData.append("files", file));

    try {
      const config = {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post("/sections", formData, config);
      setNewSectionTitle("");
      setFiles([]);
      // Refresh sections
      const response = await axios.get(`/sections/${selectedCourse._id}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setSections(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchQuestions();
    }
  }, [selectedCourse]);

  const fetchQuestions = async () => {
    console.log("Fetching questions for course:", selectedCourse._id);

    try {
      const response = await axios.get(`/entry-tests/${selectedCourse._id}`, {
        headers: { "x-auth-token": token },
      });

      setQuestions(response.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const fetchQuestionsSections = async () => {
    console.log("Fetching questions for course:", selectedCourse._id);

    try {
      const response = await axios.get(
        `/exam/${selectedCourse._id}/${newExamQuestion.sectionId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      console.log(response.data);

      setquestionsSection(response.data.questions);
      setSelectedSection(response.data.title);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/entry-tests/${selectedCourse._id}`,
        { ...newQuestion },
        {
          headers: { "x-auth-token": token },
        }
      );
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctOption: "",
      });
      fetchQuestions();
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  const handleAddQuestionSection = async (e) => {
    e.preventDefault();
    console.log(newExamQuestion);

    try {
      await axios.post(
        `/exam/${selectedCourse._id}`,
        { ...newExamQuestion },
        {
          headers: { "x-auth-token": token },
        }
      );
      setNewExamQuestion({
        sectionId: "",
        question: "",
        options: ["", "", "", ""],
        correctOption: "",
      });
      fetchQuestionsSections();
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.post(`/courses/${courseId}`, {
        method: "DELETE",
      });

      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left side - Courses List */}
        <div className="col-md-8">
          <h2>My Courses</h2>
          <div className="row">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course._id} className="col-md-4 mb-4">
                  <div className="card">
                    {course.logo && (
                      <img
                        src={`${baseURL}${course.logo}`}
                        alt={course.title}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{course.title}</h5>
                      <p className="card-text">{course.description}</p>
                      <p className="card-text">
                        <strong>Fee:</strong> ${course.fee}
                      </p>
                      <button
                        className="btn btn-info me-2"
                        onClick={() => setSelectedCourse(course)}
                      >
                        Open
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(course._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No courses available. Start creating your first course!</p>
            )}
          </div>
        </div>

        {/* Right side - Create New Course Section */}
        <div className="col-md-4">
          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "Create New Course"}
            </button>
          </div>

          {/* Show form if the button is clicked */}
          {showCreateForm && (
            <div className="card p-4 shadow">
              <h3>Create New Course</h3>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Course Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Course Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="fee" className="form-label">
                    Course Fee
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="fee"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">
                    Course Logo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="logo"
                    onChange={(e) => setLogo(e.target.files[0])}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success">
                  Create Course
                </button>
              </form>

              {message && (
                <div className="alert alert-info mt-3">{message}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section Management */}
      {selectedCourse && (
        <div className="mt-5">
          <h3>Manage Sections for {selectedCourse.title}</h3>
          <div className="mb-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "Create New Section"}
            </button>
          </div>

          {/* Show section creation form */}
          {showCreateForm && (
            <div className="card p-4 shadow">
              <h3>Create New Section</h3>
              <form
                onSubmit={handleSectionSubmit}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <label htmlFor="sectionTitle" className="form-label">
                    Section Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sectionTitle"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="sectionNote" className="form-label">
                    Section Note
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="sectionNote"
                    value={note}
                    onChange={(e) => setnote(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="files" className="form-label">
                    Upload Materials (videos, PDFs)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="files"
                    multiple
                    onChange={(e) => setFiles([...e.target.files])}
                  />
                </div>

                <button type="submit" className="btn btn-success">
                  Create Section
                </button>
              </form>
            </div>
          )}

          {/* Display sections */}
          <div className="mt-4">
            {sections.length > 0 ? (
              sections.map((section) => (
                <div key={section._id} className="card mb-3">
                  <div className="card-header">{section.title}</div>
                  <div className="card-header">{section.note}</div>
                  <ul className="list-group list-group-flush">
                    {section.materials.map((material, index) => (
                      <li key={index} className="list-group-item">
                        {material.type === "video" ? (
                          <video width="320" height="240" controls>
                            <source
                              src={`${baseURL}${material.url}`}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <a
                            href={`${baseURL}${material.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {material.url.split("/").pop()}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No sections available for this course.</p>
            )}
          </div>
          {selectedCourse && (
            <div className="mt-5">
              <h3>Entry Test for {selectedCourse.title}</h3>
              <form onSubmit={handleAddQuestion} className="mb-4">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Question"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  required
                />
                {newQuestion.options.map((opt, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.options];
                      updatedOptions[index] = e.target.value;
                      setNewQuestion({
                        ...newQuestion,
                        options: updatedOptions,
                      });
                    }}
                    required
                  />
                ))}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Correct Answer"
                  value={newQuestion.correctOption}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      correctOption: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit" className="btn btn-success">
                  Add Question
                </button>
              </form>

              <h4>Questions</h4>
              <ul className="list-group">
                {questions.map((q) => (
                  <li key={q._id} className="list-group-item">
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedCourse && (
            <div className="mt-5">
              <h3>Exam for Sections</h3>
              <form onSubmit={handleAddQuestionSection} className="mb-4">
                <select
                  id="sectionSelect"
                  value={newExamQuestion.sectionId}
                  onChange={(e) =>
                    setNewExamQuestion({
                      ...newExamQuestion,
                      sectionId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select a Section --</option>
                  {sections.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.title}{" "}
                      {/* Adjust according to your data structure */}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Question"
                  value={newExamQuestion.question}
                  onChange={(e) =>
                    setNewExamQuestion({
                      ...newExamQuestion,
                      question: e.target.value,
                    })
                  }
                  required
                />

                {newExamQuestion.options.map((opt, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updatedOptions = [...newExamQuestion.options];
                      updatedOptions[index] = e.target.value;
                      setNewExamQuestion({
                        ...newExamQuestion,
                        options: updatedOptions,
                      });
                    }}
                    required
                  />
                ))}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Correct Answer"
                  value={newExamQuestion.correctOption}
                  onChange={(e) =>
                    setNewExamQuestion({
                      ...newExamQuestion,
                      correctOption: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit" className="btn btn-success">
                  Add Question
                </button>
              </form>

              <h4>Questions</h4>
              <ul className="list-group">
                {questionsSection.map((q) => (
                  <>
                    <li key={selectedSection} className="list-group-item">
                      Section Title: <strong>{selectedSection}</strong>
                    </li>
                    <li key={q._id} className="list-group-item">
                      {q.question}
                    </li>
                  </>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
