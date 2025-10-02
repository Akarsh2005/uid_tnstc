import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './mybooking.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  if (bookings.length === 0) {
    return (
      <div className="bookings-empty">
        <div className="bookings-empty-content">
          <h2 className="bookings-empty-title">My Bookings</h2>
          <p className="bookings-empty-message">No bookings found. Book your first trip!</p>
          <Link to="/home" className="bookings-empty-button">
            Start Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-content">
        <div className="bookings-header">
          <h2 className="bookings-title">My Bookings</h2>
          <button
            className="bookings-home-button"
            onClick={() => navigate('/home')}
            aria-label="Back to Home"
          >
            Back to Home
          </button>
        </div>
        <div className="bookings-table-container">
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Seats</th>
                  <th>Fare</th>
                  <th>Journey Date</th>
                  <th>Status</th>
                  <th>Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const isBus = booking.busId && typeof booking.busId === 'object';
                  const title = isBus
                    ? `${booking.busId.corporation} - ${booking.busId.busType} (${booking.busId.route})`
                    : booking.tourId?.title || 'N/A';
                  const type = isBus ? 'Bus' : 'Tour';
                  const status = booking.status || 'Confirmed';

                  return (
                    <tr key={booking._id} className="bookings-table-row">
                      <td>{type}</td>
                      <td>{title}</td>
                      <td>{booking.seatsBooked.join(', ')}</td>
                      <td>₹{booking.totalFare}</td>
                      <td>{new Date(booking.journeyDate).toLocaleDateString('en-GB')}</td>
                      <td>
                        <span className={`bookings-status bookings-status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;