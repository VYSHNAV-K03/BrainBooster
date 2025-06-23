import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "../axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/courses/all"); // Fetch all courses
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="text-center">Loading courses...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Available Courses</h1>
      <div className="row">
        {courses
          .filter((course) => course.isVerified)
          .map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card h-100">
                {course.logo && (
                  <img
                    src={`http://localhost:5000${course.logo}`}
                    alt={course.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">
                    {course.description.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Courses;
