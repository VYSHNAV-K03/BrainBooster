import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4 mb-5 bg-light rounded" style={{ maxWidth: '400px', transition: 'all 0.3s ease-in-out' }}>
        <div className="card-body text-center">
          <img
            src="https://static-00.iconduck.com/assets.00/profile-major-icon-512x512-xosjbbdq.png"
            alt="Profile"
            className="rounded-circle mb-3 img-fluid border border-primary p-2"
            style={{ width: '150px', height: '150px' }}
          />
          <h4 className="card-title text-primary fw-bold">{user?.name || 'N/A'}</h4>
          <p className="card-text text-dark fw-semibold"><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p className="card-text text-dark fw-semibold"><strong>Role:</strong> {user?.role || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
