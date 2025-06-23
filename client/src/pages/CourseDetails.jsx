import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { base } from '../axios';
import Modal from 'react-bootstrap/Modal';


const CourseDetails = () => {
  const { id } = useParams(); // Get course ID from URL
  const navigate = useNavigate(); // For navigation
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testTaken, setTestTaken] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [enrolled, setEnrolled] = useState(false); // State to track enrollment
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/courses/${id}`); // Fetch course details
        setCourse(response.data);
      } catch (err) {
        setError('Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTestResult = async () => {
      try {
        const response = await axios.get(`/entry-tests/result/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        if (response.data) {
          setTestTaken(true);
          setTestScore(response.data.score);
        }
      } catch (err) {
        console.error('Failed to fetch test result:', err);
      }
    };

    const checkEnrollment = async () => {
      try {
        const response = await axios.get(`/courses/enrolled/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        if (response.data.enrolled) {
          setEnrolled(true); // Set to true if user is enrolled
        }
      } catch (err) {
        console.error('Failed to check enrollment status:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/review/${id}/reviews`);
        setReviews(response.data);
        
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };

    checkEnrollment(); // Check enrollment status when the component mounts
    fetchCourse();
    fetchReviews();
    fetchTestResult();
  }, [id]);

  if (loading) return <div className="text-center">Loading course details...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  const handleEnroll = () => {
    navigate(`/payment/${id}/${course.fee}`); // Navigate to payment page
  };

  const handleSubmitReview = async () => {
    if (!reviewText) return alert('Please enter a review');
    
    const formData = new FormData();
    formData.append('text', reviewText);
    formData.append('rating', rating);
    if (reviewImage) formData.append('image', reviewImage);

    try {
      await axios.post(`/review/${id}/reviews`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      setReviewText('');
      setReviewImage(null);
      setRating(5);
      alert('Review submitted!');
      window.location.reload();
    } catch (err) {
      console.error('Error submitting review', err);
      alert('Failed to submit review');
    }
  };

  const handleStartCourse = () => {
    navigate(`/course/${id}/start`); // Navigate to the course content
  };

  const handleTakeTest = () => {
    navigate(`/entrytest/${id}`); // Navigate to entry test page
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Column: Course Information */}
        <div className="col-md-8">
          <h1 className="mb-3">{course.title}</h1>
          <p className="lead">{course.description}</p>
          <p><strong>Fee:</strong> ₹{course.fee}</p>
          {course.logo && (
            <img
              src={`http://localhost:5000${course.logo}`}
              alt={course.title}
              className="img-fluid rounded mb-4"
            />
          )}
          <h3>What you'll learn</h3>
          <ul>
            <li>Comprehensive course content</li>
            <li>Mentorship and guidance</li>
            <li>Real-world projects</li>
          </ul>
        </div>

        {/* Right Column: Payment Section */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Entry Test Requirement</h4>
            {testTaken ? (
              testScore >= 50 ? (
                <>
                  <p className="text-muted mb-4">You passed the entry test with {testScore}%. You can now enroll!</p>
                  {enrolled ? (
                    <button className="btn btn-success w-100" onClick={handleStartCourse}>
                      Start Course
                    </button>
                  ) : (
                    <button className="btn btn-primary w-100" onClick={handleEnroll}>
                      Enroll Now
                    </button>
                  )}
                </>
              ) : (
                <>
                <p className="text-danger">You scored {testScore}%. You need at least 50% to enroll.</p>
                <button className="btn btn-secondary w-100" onClick={handleTakeTest}>
                  Take Entry Test
                </button>
                </>
              )
            ) : (
              <>
                <p className="text-warning">You must take the entry test before enrolling.</p>
                <button className="btn btn-secondary w-100" onClick={handleTakeTest}>
                  Take Entry Test
                </button>
              </>
            )}
          </div>
        </div>
          {/* Review Section */}
      <div className="mt-5">
        <h3>Customer Reviews</h3>
        <ul className="list-group">
          {reviews.map((review, index) => (
            <li key={index} className="list-group-item">
              <strong>
                {review.text}
              </strong>
              <p>{'⭐'.repeat(review.rating)}</p>
              {review.image && (
                <img
                src={base + '/' + review.image}
                alt="Review"
                style={{ width: '100px', cursor: 'pointer' }}
                onClick={() => setSelectedImage(base + review.image)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Review Form */}
      <div className="mt-4">
        <h4>Write a Review</h4>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Share your thoughts"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
          <label>Rating:</label>
          <select className="form-control mb-2" value={rating} onChange={(e) => setRating(e.target.value)} required>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{'⭐'.repeat(num)}</option>
            ))}
          </select>
        <input
          type="file"
          className="form-control mt-2"
          accept="image/*"
          onChange={(e) => setReviewImage(e.target.files[0])}
        />
        <button className="btn btn-success mt-2" onClick={handleSubmitReview}>Submit Review</button>
      </div>

      {/* Image Modal */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)}>
        <Modal.Body className="text-center">
          {selectedImage && <img src={selectedImage} alt="Enlarged" className="img-fluid" />}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setSelectedImage(null)}>Close</button>
        </Modal.Footer>
      </Modal>

      </div>
    </div>
  );
};

export default CourseDetails;
