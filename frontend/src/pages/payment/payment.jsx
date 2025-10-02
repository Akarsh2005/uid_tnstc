import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { bus, tour, seatsBooked, type } = state || {};
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const userId = user?._id;

  const confirmBooking = async () => {
    try {
      if (!userId) {
        alert('Please log in to continue.');
        return;
      }

      if (type === 'tour') {
        await axios.post('http://localhost:5001/api/bookings/tour', {
          userId,
          tourId: tour._id,
          seatsBooked
        });
      } else {
        await axios.post('http://localhost:5001/api/bookings', {
          userId,
          busId: bus._id,
          seatsBooked
        });
      }

      alert("Booking confirmed!");
      navigate('/mybookings');
    } catch (err) {
      alert("Booking failed");
      console.error("Payment error:", err);
    }
  };

  const item = bus || tour;
  const title = item?.busName || item?.title;
  const farePerSeat = item?.fare || 0;
  const totalFare = farePerSeat * (seatsBooked?.length || 0);

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Payment Page</h2>
      <div style={{ textAlign: 'left', lineHeight: '2' }}>
        <p><b>Booking Type:</b> {type === 'tour' ? 'Tour Package' : 'Bus Ticket'}</p>
        <p><b>Title:</b> {title}</p>
        <p><b>Seats Selected:</b> {seatsBooked?.join(', ')}</p>
        <p><b>Fare Per Seat:</b> ₹{farePerSeat}</p>
        <p><b>Total Fare:</b> ₹{totalFare}</p>
      </div>
      <button onClick={confirmBooking} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Confirm Booking & Pay
      </button>
    </div>
  );
};

export default PaymentPage;
