import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // For handling roles like 'admin', 'mentor'
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  console.log(userRole);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user"); // Assuming role is stored in localStorage

    console.log(role);

    if (token) {
      setIsLoggedIn(true);
      setUserRole(role); // Set the user's role
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // If role is stored in localStorage
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          BRAINBOOSTER
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            {user?.role === "user" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/timetable">
                    TimeTable
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ai">
                    Resources
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                
              </>
            ) : (
              <>
                {/* Conditionally render links based on user role */}
                {user?.role === "mentor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/mentor/dashboard">
                      Mentor Dashboard
                    </Link>
                  </li>
                )}
                {user?.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>

              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
