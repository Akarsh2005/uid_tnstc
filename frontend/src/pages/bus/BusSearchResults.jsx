import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BusSearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const buses = state?.results || [];
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatChange = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const proceedToPayment = () => {
    if (!selectedSeats.length) return alert("Please select at least one seat.");
    navigate('/payment', {
      state: {
        bus: selectedBus,
        seatsBooked: selectedSeats,
        type: 'bus'
      }
    });
  };

  const renderSeatGrid = () => {
    const rows = 3;
    const seatsPerRow = 8;
    const layout = [];

    for (let r = 0; r < rows; r++) {
        const rowSeats = [];
        for (let c = 1; c <= seatsPerRow; c++) {
        const seatNumber = r * seatsPerRow + c;
        const isBooked = selectedBus.bookedSeats.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        rowSeats.push(
            <button
            key={seatNumber}
            disabled={isBooked}
            onClick={() => handleSeatChange(seatNumber)}
            style={{
                width: '40px',
                height: '40px',
                margin: '5px',
                backgroundColor: isBooked ? 'gray' : isSelected ? 'green' : 'white',
                color: isBooked ? 'white' : 'black',
                border: '1px solid black',
                cursor: isBooked ? 'not-allowed' : 'pointer'
            }}
            >
            {seatNumber}
            </button>
        );
        }
        layout.push(
        <div
            key={`row-${r}`}
            style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: r === 1 ? '20px' : '10px' // adds a gap after row 2
            }}
        >
            {rowSeats}
        </div>
        );
    }
    return layout;
    };


  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Buses</h2>
      {buses.length === 0 ? (
        <p>No buses found.</p>
      ) : (
        <>
          <table border="1" cellPadding="10" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Bus Name</th>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Fare</th>
                <th>Seats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus._id}>
                  <td>{bus.busName}</td>
                  <td>{bus.source}</td>
                  <td>{bus.destination}</td>
                  <td>{bus.departureTime}</td>
                  <td>{bus.arrivalTime}</td>
                  <td>{bus.fare}</td>
                  <td>{bus.seats}</td>
                  <td>
                    <button onClick={() => {
                      setSelectedBus(bus);
                      setSelectedSeats([]);
                    }}>Book</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedBus && (
            <div style={{ marginTop: '30px' }}>
              <h3>Select Seats for {selectedBus.busName}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {renderSeatGrid()}
              </div>
              <button style={{ marginTop: '20px' }} onClick={proceedToPayment}>Proceed to Payment</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusSearchResults;
