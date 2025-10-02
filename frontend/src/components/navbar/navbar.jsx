// components/navbar/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/home" style={styles.link}>🚌 TNSTC Clone</Link>
      </div>

      <ul style={styles.navItems}>
        <li><Link to="/home" style={styles.link}>Book Ticket</Link></li>
        <li><Link to="/packages" style={styles.link}>Packages</Link></li>
        <li><Link to="/mybookings" style={styles.link}>Track Ticket</Link></li>
        {/* Add more actions here like Cancel Ticket if needed */}
        {user && (
          <li>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  navItems: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Navbar;
