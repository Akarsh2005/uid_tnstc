import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>User</th>
              <th>Email</th>
              <th>From → To</th>
              <th>Seats</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const isBus = booking.busId;
              const title = isBus
                ? booking.busId?.busName
                : booking.tourId?.title;

              const fromTo = isBus
                ? `${booking.busId?.source} → ${booking.busId?.destination}`
                : `${booking.tourId?.title}`;

              return (
                <tr key={booking._id}>
                  <td>{isBus ? 'Bus' : 'Tour'}</td>
                  <td>{title || 'N/A'}</td>
                  <td>{booking.userId?.name || 'N/A'}</td>
                  <td>{booking.userId?.emailId || 'N/A'}</td>
                  <td>{fromTo}</td>
                  <td>{booking.seatsBooked.join(', ')}</td>
                  <td>₹{booking.totalFare}</td>
                  <td>{booking.status}</td>
                  <td>{new Date(booking.createdAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Booking;
