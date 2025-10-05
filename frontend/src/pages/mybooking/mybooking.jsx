import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './mybooking.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const navigate = useNavigate();

  const cancellationReasons = [
    'Change of Plans',
    'Medical Emergency',
    'Travel Restrictions',
    'Personal Reasons',
    'Found a Better Option',
    'Other'
  ];

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  const handleCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    if (!cancelReason) {
      alert('Please select or enter a cancellation reason.');
      return;
    }

    const updatedBookings = bookings.map((booking) =>
      booking._id === selectedBookingId
        ? {
            ...booking,
            status: 'Canceled',
            cancellationReason: cancelReason,
            canceledAt: new Date().toISOString()
          }
        : booking
    );

    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setShowCancelModal(false);
    setSelectedBookingId(null);
    setCancelReason('');
    alert(`Booking canceled successfully! The money will be refunded to your bank account within 7-10 working days.`);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
    setCancelReason('');
  };

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
                  <th>Cancellation Reason</th>
                  <th>Action</th>
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
                      <td>{booking.cancellationReason || '-'}</td>
                      <td>
                        {status === 'Confirmed' && (
                          <button
                            className="bookings-cancel-button"
                            onClick={() => handleCancelBooking(booking._id)}
                            aria-label={`Cancel booking ${booking._id}`}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Cancel Booking</h3>
            <p className="modal-message">Please select a reason for cancellation:</p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="modal-select"
            >
              <option value="">Select a reason</option>
              {cancellationReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {cancelReason === 'Other' && (
              <input
                type="text"
                value={cancelReason === 'Other' ? '' : cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter custom reason"
                className="modal-input"
              />
            )}
            <div className="modal-buttons">
              <button
                className="modal-confirm-button"
                onClick={confirmCancelBooking}
              >
                Confirm Cancel
              </button>
              <button
                className="modal-close-button"
                onClick={closeCancelModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;