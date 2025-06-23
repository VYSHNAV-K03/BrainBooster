// frontend/src/pages/RegisterMentor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const RegisterMentor = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState(''); // Additional field for mentor details
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', { name, email, password, role: 'mentor', bio });
      navigate('/login');
    } catch (error) {
      console.error('Mentor registration failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Register as Mentor</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register as Mentor</button>
      </form>
    </div>
  );
};

export default RegisterMentor;
