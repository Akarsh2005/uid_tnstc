import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome, Admin</h1>
      <button onClick={() => navigate('/buses')} style={btnStyle}>Manage Buses</button>
      <button onClick={() => navigate('/tours')} style={btnStyle}>Manage Tours</button>
      <button onClick={() => navigate('/bookings')} style={btnStyle}>View Bookings</button>
    </div>
  );
};

const btnStyle = {
  margin: '20px',
  padding: '10px 20px',
  fontSize: '16px'
};

export default Home;
