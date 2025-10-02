import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './payment.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { busDetails, selectedSeats, tourDetails, numberOfPersons, totalPrice, journeyDate } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if ((!busDetails && !tourDetails) || (!selectedSeats && !numberOfPersons) || !totalPrice || !journeyDate) {
    return (
      <div className="payment-error">
        <h2 className="payment-error-title">Oops! Something went wrong.</h2>
        <p className="payment-error-message">Booking details not found. Please start your search again.</p>
        <Link to="/home" className="payment-error-button">
          Go to Home
        </Link>
      </div>
    );
  }

  const isBusBooking = !!busDetails;
  const bookingType = isBusBooking ? 'Bus Booking' : 'Tour Booking';
  const bookingId = Date.now().toString().slice(-6);

  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = 'Enter valid MM/YY';
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = 'Enter a valid 3-digit CVV';
      }
    } else {
      if (!/^[a-zA-Z0-9.\-_]{3,}@[a-zA-Z0-9.\-_]+$/.test(formData.upiId)) {
        newErrors.upiId = 'Enter a valid UPI ID (e.g., user@upi)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim()
        .slice(0, 19);
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleEditBooking = () => {
    if (isBusBooking) {
      navigate('/buses', { state: { formData: { journeyDate } } });
    } else {
      navigate('/tours');
    }
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        _id: bookingId,
        busId: busDetails,
        tourId: tourDetails,
        seatsBooked: selectedSeats || [],
        numberOfPersons: numberOfPersons || 0,
        totalFare: totalPrice,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        journeyDate,
      };
      localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));
      setShowSuccessModal(true);
    } catch (err) {
      alert('Booking simulation failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/mybookings');
  };

  const farePerUnit = isBusBooking
    ? Array.isArray(busDetails.price)
      ? busDetails.price[0]
      : busDetails.price
    : tourDetails.fare;

  return (
    <div className="payment-container">
      <div className="payment-demo-banner">
        This is a demo. No real payment is processed. Bookings are saved locally.
      </div>
      <div className="payment-content">
        <div className="payment-summary">
          <h2 className="payment-summary-title">{bookingType}</h2>
          <div className="payment-summary-details">
            {isBusBooking ? (
              <>
                <div className="payment-summary-item">
                  <span>Route:</span>
                  <span>{busDetails.route} ({busDetails.via})</span>
                </div>
                <div className="payment-summary-item">
                  <span>Bus Type:</span>
                  <span>{busDetails.busType}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Corporation:</span>
                  <span>{busDetails.corporation}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Departure:</span>
                  <span>{busDetails.departure} | Arrival: {busDetails.arrival}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Seats:</span>
                  <span className="payment-seats">{selectedSeats.join(', ')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="payment-summary-item">
                  <span>Tour:</span>
                  <span>{tourDetails.title}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Route:</span>
                  <span>{tourDetails.route}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Starting Point:</span>
                  <span>{tourDetails.startingPoint}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Time:</span>
                  <span>{tourDetails.time}</span>
                </div>
                <div className="payment-summary-item">
                  <span>Persons:</span>
                  <span className="payment-seats">{numberOfPersons}</span>
                </div>
              </>
            )}
            <div className="payment-summary-item">
              <span>Journey Date:</span>
              <span>{new Date(journeyDate).toLocaleDateString('en-GB')}</span>
            </div>
            <div className="payment-summary-item">
              <span>Fare Per {isBusBooking ? 'Seat' : 'Person'}:</span>
              <span>Rs {farePerUnit}</span>
            </div>
            <div className="payment-summary-item payment-total">
              <span>Total Amount:</span>
              <span className="payment-total-amount text-green-600">Rs {totalPrice}</span>
            </div>
            <button
              className="payment-edit-button"
              onClick={handleEditBooking}
              aria-label="Edit booking details"
            >
              Edit Booking
            </button>
          </div>
        </div>
        <div className="payment-form">
          <h2 className="payment-form-title">Enter Payment Details</h2>
          <div className="payment-tabs">
            <button
              className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
              aria-label="Pay with card"
            >
              <svg className="payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Card
            </button>
            <button
              className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
              aria-label="Pay with UPI"
            >
              <svg className="payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"></path>
                <path d="M8 12l4 4 4-4"></path>
              </svg>
              UPI
            </button>
          </div>
          <form className="payment-form-content" onSubmit={confirmBooking}>
            {paymentMethod === 'card' ? (
              <>
                <div className="payment-form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
                  />
                  {errors.cardNumber && (
                    <span className="payment-error-text" id="cardNumber-error">
                      {errors.cardNumber}
                    </span>
                  )}
                </div>
                <div className="payment-form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    aria-describedby={errors.cardName ? 'cardName-error' : undefined}
                  />
                  {errors.cardName && (
                    <span className="payment-error-text" id="cardName-error">
                      {errors.cardName}
                    </span>
                  )}
                </div>
                <div className="payment-form-row">
                  <div className="payment-form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      aria-describedby={errors.expiry ? 'expiry-error' : undefined}
                    />
                    {errors.expiry && (
                      <span className="payment-error-text" id="expiry-error">
                        {errors.expiry}
                      </span>
                    )}
                  </div>
                  <div className="payment-form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="***"
                      maxLength="3"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                    />
                    {errors.cvv && (
                      <span className="payment-error-text" id="cvv-error">
                        {errors.cvv}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="payment-form-group">
                <label htmlFor="upiId">UPI ID</label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  placeholder="user@upi"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  required
                  aria-describedby={errors.upiId ? 'upiId-error' : undefined}
                />
                {errors.upiId && (
                  <span className="payment-error-text" id="upiId-error">
                    {errors.upiId}
                  </span>
                )}
              </div>
            )}
            <button
              type="submit"
              className="payment-submit-button"
              disabled={isProcessing}
              aria-label={`Pay Rs ${totalPrice}`}
              title={isProcessing ? 'Processing payment...' : `Pay Rs ${totalPrice}`}
            >
              {isProcessing ? (
                <span className="payment-processing">
                  <svg className="payment-spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay Rs ${totalPrice} Now`
              )}
            </button>
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <div className="payment-success-modal" role="dialog" aria-modal="true">
          <div className="payment-success-content">
            <h3 className="payment-success-title">🎉 Payment Successful!</h3>
            <div className="payment-success-details">
              <p>
                <span>Booking ID:</span> {bookingId}
              </p>
              {isBusBooking ? (
                <>
                  <p>
                    <span>Seats:</span> {selectedSeats.join(', ')}
                  </p>
                  <p>
                    <span>Bus:</span> {busDetails.corporation} - {busDetails.busType}
                  </p>
                  <p>
                    <span>Route:</span> {busDetails.route}
                  </p>
                  <p>
                    <span>Departure:</span> {busDetails.departure} | <span>Arrival:</span>{' '}
                    {busDetails.arrival}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span>Tour:</span> {tourDetails.title}
                  </p>
                  <p>
                    <span>Route:</span> {tourDetails.route}
                  </p>
                  <p>
                    <span>Starting Point:</span> {tourDetails.startingPoint}
                  </p>
                  <p>
                    <span>Persons:</span> {numberOfPersons}
                  </p>
                </>
              )}
              <p>
                <span>Date:</span> {new Date(journeyDate).toLocaleDateString('en-GB')}
              </p>
              <p>
                <span>Total:</span>{' '}
                <span className="payment-success-total text-green-600">Rs {totalPrice}</span>
              </p>
            </div>
            <p className="payment-success-message">Confirmed! Check "My Bookings" for details. Happy Journey!</p>
            <button
              className="payment-success-button"
              onClick={closeSuccessModal}
              aria-label="View my bookings"
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;