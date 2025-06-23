import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { base } from "../axios";
import { FaVideo, FaFilePdf, FaUserTie, FaGlobe } from "react-icons/fa";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StartCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [inputtranlate, setinputtranlate] = useState("")
  const [inputText, setinputText] = useState("")
  const [language, setLanguage] = useState("ml"); // Default: Malayalam
  const [mentor, setMentor] = useState(null);
  const [pdfText, setPdfText] = useState("");

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/courses/${id}/start`);
      setCourse(response.data.course);
      setSections(response.data.sections);
      const mentor_res = await axios.get(`/auth/${response.data.course.mentor}`);
      console.log(mentor_res.data);
      setMentor(mentor_res.data);
    } catch (err) {
      setError("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseSectionExam = async () => {
    try {
      const response = await axios.get(`/courses/${id}/start/exam`);
      
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchCourseSectionExam();
  }, [id]);


  

  console.log(sections);


  

  const translateText = async (text,index) => {
    try {
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${language}`
      );
      console.log(response.data.responseData.translatedText);
      
      setTranslatedText((prev) => ({
        ...prev,
        [index]: response.data.responseData.translatedText,
      }));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const translateInput = async (text,index) => {
    try {
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|${language}`
      );
      console.log(response.data.responseData.translatedText);
      
      setinputtranlate( response.data.responseData.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading course...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  const extractTextFromPDF = async (file) => {
    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
  
      const response = await axios.post("/pdf/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setPdfText(response.data.text);
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      setPdfText("Failed to extract text.");
    }
  };
  
  const handleMaterialClick = (material) => {
    if (material.type === "video") {
      window.open(base + material.url, "_blank");
    } else if (material.type === "pdf") {
      // Fetch the PDF and send it to the backend
      window.open(base + material.url, "_blank");
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Column: Course Details & Sections */}
        <div className="col-lg-8">
          <div className="card shadow-lg p-4">
            <h1 className="mb-3 text-primary">{course.title}</h1>
            <p className="text-muted">{course.description}</p>
            <p className="fw-bold text-success">Fee: ₹{course.fee}</p>

            {course.logo && (
              <img
                src={`http://localhost:5000${course.logo}`}
                alt={course.title}
                className="img-fluid rounded shadow-sm mb-4"
              />
            )}

            {/* Course Sections */}
            <div>
              <h3 className="mb-3 text-dark">Course Content</h3>
              <div className="accordion" id="courseAccordion">
                {sections.length > 0 ? (
                  sections.map((section, index) => (
                    <div
                      className="accordion-item border-0 shadow-sm mb-2"
                      key={index}
                    >
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className="accordion-button bg-light text-dark fw-bold"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded="true"
                          aria-controls={`collapse${index}`}
                        >
                          {section.title}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className="accordion-collapse collapse show"
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#courseAccordion"
                      >
                        <div className="accordion-body">
                          {section.note && (
                            <p className="text-muted">
                              <strong>Note:</strong> {section.note}
                            </p>
                          )}

                          {/* Translation Section */}
                          <div className="d-flex align-items-center mb-3">
                            <FaGlobe className="me-2 text-primary" />
                            <select
                              className="form-select w-auto me-2"
                              onChange={(e) => setLanguage(e.target.value)}
                            >
                              <option value="ml">Malayalam</option>
                              <option value="ta">Tamil</option>
                              <option value="kn">Kannada</option>
                              <option value="hi">Hindi</option>
                            </select>
                            <button
                              className="btn btn-primary"
                              onClick={() => translateText(section.note, index)}
                            >
                              Translate
                            </button>
                          </div>
                          <p className="fw-bold text-success">
                            {translatedText[index]}
                          </p>

                          <ul className="list-group">
                            {section.materials.map((material, idx) => (
                              <li
                                key={idx}
                                className="list-group-item d-flex align-items-center border-0"
                              >
                                {material.type === "video" ? (
                                  <FaVideo className="text-danger me-2" />
                                ) : (
                                  <FaFilePdf className="text-primary me-2" />
                                )}
                                <button
                                  className="btn btn-link text-decoration-none text-dark fw-bold"
                                  onClick={() => handleMaterialClick(material)}
                                >
                                  {material.type === "video"
                                    ? "Watch Video"
                                    : "View PDF"}
                                </button>
                              </li>
                            ))}
                          </ul>
                          {pdfText && (
                            <div className="mt-3 p-3 bg-light rounded">
                              <h5 className="text-dark">Extracted PDF Text:</h5>
                              <p
                                className="text-muted"
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {pdfText}
                              </p>
                              <button
                                className="btn btn-primary"
                                onClick={() => translateText(pdfText, index)}
                              >
                                Translate
                              </button>
                              <p className="fw-bold text-success">
                                {translatedText[index]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    No sections available for this course.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mentor Details */}
        <div className="col-lg-4">
          <div className="card shadow-lg p-4 bg-light">
            <h4 className="mb-3 text-dark">
              <FaUserTie className="me-2 text-warning" /> Course Mentor
            </h4>
            {course.mentor ? (
              <div className="text-center">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="fw-bold text-primary h5">{mentor.name}</p>
                  <p className="text-muted">
                    Passionate educator with expertise in guiding students to
                    success through hands-on learning
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No mentor assigned yet.</p>
            )}
          </div>
          <div className="card shadow-lg p-4 bg-light">
              <input
                type="text"
                className="form-control mb-3"
                value={inputText}
                onChange={(e) => setinputText(e.target.value)}
                placeholder="Enter text to translate"
              />
            <div className="d-flex align-items-center mb-3">

              <FaGlobe className="me-2 text-primary" />
              <select
                className="form-select w-auto me-2"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="ml">Malayalam</option>
                <option value="ta">Tamil</option>
                <option value="kn">Kannada</option>
                <option value="hi">Hindi</option>
              </select>
              <button
                className="btn btn-primary"
                onClick={() => translateInput(inputText)}
              >
                Translate
              </button>
            </div>
            <p className="fw-bold text-success">{inputtranlate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCourse;
