import React from 'react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-section vh-100 d-flex align-items-center text-white text-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1462536943532-57a629f6cc60?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Discover Amazing Experiences</h1>
          <p className="lead mt-3">
            Join us in exploring the beauty of technology and innovation.
          </p>
          <a href="/courses" className="btn btn-primary btn-lg mt-4 px-4">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
