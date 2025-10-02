import React, { useState, useMemo } from 'react';
import './SeatSelectionModal.css';

const SeatSelectionModal = ({ bus, tour, formData, onClose, onConfirmBooking }) => {
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [error, setError] = useState('');

  console.log('SeatSelectionModal formData:', formData); // Debug

  const isBusBooking = !!bus;
  const entity = isBusBooking ? bus : tour;

  if (!bus && !tour) return null;

  const handleSeatClick = (seatNumber) => {
    if (bus.unavailableSeats?.includes(seatNumber)) return;
    if (formData?.singleLady && !isLadiesSeat(seatNumber)) {
      setError('Selected seat not available for single lady. Please choose an even-numbered seat.');
      return;
    }

    const newSelectedSeats = new Set(selectedSeats);
    if (newSelectedSeats.has(seatNumber)) {
      newSelectedSeats.delete(seatNumber);
    } else {
      if (newSelectedSeats.size >= 6) {
        setError('You can select a maximum of 6 seats.');
        return;
      }
      newSelectedSeats.add(seatNumber);
    }
    setSelectedSeats(newSelectedSeats);
    setError('');
  };

  const isLadiesSeat = (seatNumber) => seatNumber % 2 === 0;

  const handlePersonsChange = (value) => {
    const num = parseInt(value) || 1;
    if (num < 1 || num > 6) {
      setError('Please select 1-6 persons.');
      return;
    }
    setNumberOfPersons(num);
    setError('');
  };

  const totalPrice = useMemo(() => {
    if (isBusBooking) {
      const pricePerSeat = Array.isArray(bus.price) ? bus.price[0] : bus.price;
      return selectedSeats.size * pricePerSeat;
    } else {
      return numberOfPersons * tour.tour.fare;
    }
  }, [isBusBooking, bus, tour, selectedSeats, numberOfPersons]);

  const seatsPerRow = 3;
  const numRows = 10;
  const seatElements = [];
  let rowLabel = 'A';

  if (isBusBooking) {
    for (let row = 0; row < numRows; row++) {
      const rowSeats = [];
      for (let col = 0; col < 2; col++) {
        const seatNumber = row * seatsPerRow + col + 1;
        if (seatNumber <= bus.seats) {
          rowSeats.push(createSeatElement(seatNumber));
        }
      }
      const rightSeatNumber = row * seatsPerRow + 3;
      if (rightSeatNumber <= bus.seats) {
        rowSeats.push(<div key="aisle" className="aisle"></div>);
        rowSeats.push(createSeatElement(rightSeatNumber));
      }

      seatElements.push(
        <div key={`row-${row}`} className="seat-row">
          <span className="row-label">{rowLabel}</span>
          <div className="seat-grid">{rowSeats}</div>
        </div>
      );
      rowLabel = String.fromCharCode(rowLabel.charCodeAt(0) + 1);
    }
  }

  function createSeatElement(seatNumber) {
    const isSelected = selectedSeats.has(seatNumber);
    const isUnavailable = bus.unavailableSeats?.includes(seatNumber);
    let seatClass = 'seat';
    if (isSelected) seatClass += ' selected';
    else if (isUnavailable) seatClass += ' unavailable';
    else seatClass += ' available';
    if (formData?.singleLady && isLadiesSeat(seatNumber)) seatClass += ' ladies';

    return (
      <div
        key={seatNumber}
        className={seatClass}
        onClick={() => handleSeatClick(seatNumber)}
        aria-label={`Seat ${seatNumber} ${isSelected ? 'selected' : isUnavailable ? 'unavailable' : formData?.singleLady && isLadiesSeat(seatNumber) ? 'available (ladies)' : 'available'}`}
      >
        {seatNumber}
      </div>
    );
  }

  const handleBooking = () => {
    if (isBusBooking && selectedSeats.size === 0) {
      setError('Please select at least one seat.');
      return;
    }
    if (!isBusBooking && numberOfPersons < 1) {
      setError('Please select at least one person.');
      return;
    }
    if (!formData?.journeyDate) {
      setError('Please select a journey date.');
      return;
    }
    console.log('Booking data:', { // Debug
      entity,
      seats: isBusBooking ? Array.from(selectedSeats) : numberOfPersons,
      totalPrice,
      journeyDate: formData.journeyDate,
    });
    onConfirmBooking(
      entity,
      isBusBooking ? Array.from(selectedSeats) : numberOfPersons,
      totalPrice,
      formData.journeyDate
    );
  };

  const getButtonDisableReason = () => {
    if (!formData?.journeyDate) return 'Please select a journey date';
    if (isBusBooking && selectedSeats.size === 0) return 'Please select at least one seat';
    if (!isBusBooking && numberOfPersons < 1) return 'Please select at least one person';
    return '';
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {isBusBooking ? 'Select Your Seats' : 'Confirm Tour Booking'}
          </h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="info-modal">
            {isBusBooking ? (
              <>
                <p className="font-medium">{bus.corporation} - {bus.busType}</p>
                <p>{bus.route} ({bus.via})</p>
                <p>Available: {bus.seats - (bus.unavailableSeats?.length || 0)} seats</p>
                {formData?.singleLady && (
                  <p className="text-sm text-blue-600">Ladies: Select even-numbered seats only</p>
                )}
              </>
            ) : (
              <>
                <p className="font-medium">{tour.pkgTitle}</p>
                <p>{tour.tour.routeDetail}</p>
                <p>Starting Point: {tour.tour.startingPoint}</p>
                <p>Time: {tour.tour.time}</p>
                <p>Fare per Person: Rs {tour.tour.fare}</p>
              </>
            )}
            <p>Journey Date: {formData.journeyDate || 'Please select a date'}</p>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          {isBusBooking ? (
            <>
              <div className="seat-layout-container">
                <div className="seat-layout-header">
                  <span className="steering-wheel">🚍</span>
                  <span>Front</span>
                </div>
                <div className="seat-layout">{seatElements}</div>
              </div>
              <div className="legend">
                <div className="legend-item">
                  <div className="seat available-legend"></div>Available
                </div>
                <div className="legend-item">
                  <div className="seat selected-legend"></div>Selected
                </div>
                <div className="legend-item">
                  <div className="seat unavailable-legend"></div>Unavailable
                </div>
                {formData?.singleLady && (
                  <div className="legend-item">
                    <div className="seat ladies-legend"></div>Ladies
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="tour-selection">
              <label htmlFor="persons" className="tour-selection-label">
                Number of Persons (1-6)
              </label>
              <input
                type="number"
                id="persons"
                min="1"
                max="6"
                value={numberOfPersons}
                onChange={(e) => handlePersonsChange(e.target.value)}
                className="tour-persons-input"
                aria-label="Select number of persons for tour"
                aria-describedby="persons-info"
              />
              <span id="persons-info" className="sr-only">
                Select between 1 and 6 persons for the tour
              </span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="booking-summary">
            {isBusBooking ? (
              <>
                <p>
                  Seats: <span className="font-bold">{Array.from(selectedSeats).join(', ') || 'None'}</span>
                </p>
                <p>Price per Seat: Rs {Array.isArray(bus.price) ? bus.price[0] : bus.price}</p>
              </>
            ) : (
              <>
                <p>
                  Persons: <span className="font-bold">{numberOfPersons}</span>
                </p>
                <p>Price per Person: Rs {tour.tour.fare}</p>
              </>
            )}
            <p>
              Total Fare: <span className="font-bold text-lg text-green-600">Rs {totalPrice}</span>
            </p>
          </div>
          <button
            className="btn-confirm-booking"
            onClick={handleBooking}
            disabled={(isBusBooking && selectedSeats.size === 0) || (!isBusBooking && numberOfPersons < 1) || !formData?.journeyDate}
            aria-label="Proceed to payment"
            title={getButtonDisableReason()}
          >
            Proceed to Payment (Rs {totalPrice})
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionModal;