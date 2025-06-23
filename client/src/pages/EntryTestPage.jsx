import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";

const EntryTestPage = () => {
  const { id } = useParams(); // Course ID from URL
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/entry-tests/${id}`, {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setQuestions(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch test questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/entry-tests/submit/${id}`,
        { answers },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setScore(response.data.score);
      setSubmitted(true);
      navigate("/courses/" + id);
    } catch (err) {
      setError("Failed to submit test.");
    }
  };

  console.log(questions);

  if (loading) return <div className="text-center">Loading test...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Entry Test</h2>
      {submitted ? (
        <div className="alert alert-info">Your score: {score}%</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={index} className="mb-3">
              <p>
                <strong>{q.question}</strong>
              </p>
              {q.options.map((option, optIndex) => (
                <div key={optIndex} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleOptionChange(index, option)}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="btn btn-success">
            Submit Test
          </button>
        </form>
      )}
    </div>
  );
};

export default EntryTestPage;
