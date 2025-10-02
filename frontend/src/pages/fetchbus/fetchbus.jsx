import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FetchBus.css';

const FetchBus = () => {
  const location = useLocation();
  const { state } = location;
  const [formData] = useState(state?.formData || {
    fromPlace: 'Chennai',
    toPlace: 'Salem',
    onwardDate: new Date().toISOString().split('T')[0], // Default to current date (2025-09-22)
    returnDate: '',
    singleLady: false,
  });

  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [100, 1000], // [min, max]
    departureTimeRange: [0, 2359], // [min, max] in minutes
    busTypes: [],
  });
  const [selectedSeats, setSelectedSeats] = useState({}); // Track selected seats per bus ID

  // Expanded demo bus data with some unavailable seats
  const allBuses = [
    { corporation: 'SETC', busType: 'NON AC SLEEPER SEATER', departure: '22:15', duration: '6:00 Hrs', arrival: '04:15', price: [318, 492], seats: 34, unavailableSeats: [30, 31, 32, 33, 34], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ATHUR', id: '2215KCBSALNS / 422NS' },
    { corporation: 'VILLUPURAM', busType: 'DELUXE 3X2', departure: '22:15', duration: '7:00 Hrs', arrival: '05:33', price: 274, seats: 43, unavailableSeats: [40, 41, 42, 43], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-VILLUPURAM, ULUNDURPET', id: '2215KCBSALVVOIL / 281AO' },
    { corporation: 'SETC', busType: 'AC SLEEPER SEATER', departure: '22:30', duration: '6:00 Hrs', arrival: '04:30', price: [410, 631], seats: 41, unavailableSeats: [38, 39, 40, 41], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ATHUR', id: '2230KCBSALAB / 422AB' },
    { corporation: 'SETC', busType: 'ULTRA DELUXE', departure: '22:45', duration: '7:30 Hrs', arrival: '04:45', price: 318, seats: 37, unavailableSeats: [35, 36, 37], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ATHUR', id: '2245KCBSAL / 422UD' },
    { corporation: 'KUMBAKONAM', busType: 'AC 3X2', departure: '23:00', duration: '6:45 Hrs', arrival: '05:45', price: [350, 540], seats: 38, unavailableSeats: [36, 37, 38], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-TIRUCHY', id: '2300KCBSALAC / 422AC' },
    { corporation: 'COIMBATORE', busType: 'NON AC SLEEPER', departure: '23:30', duration: '7:15 Hrs', arrival: '06:45', price: 290, seats: 32, unavailableSeats: [30, 31, 32], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ERODE', id: '2330KCBSALNS / 422NS2' },
  ];

  useEffect(() => {
    // Filter buses based on formData and filters
    let buses = allBuses.filter(bus => 
      bus.route.toLowerCase().includes(formData.fromPlace.toLowerCase()) &&
      bus.route.toLowerCase().includes(formData.toPlace.toLowerCase())
    );

    // Apply filters
    buses = buses.filter(bus => {
      const price = Array.isArray(bus.price) ? bus.price[0] : bus.price;
      const departureMinutes = convertToMinutes(bus.departure);
      return (
        price >= filters.priceRange[0] &&
        price <= filters.priceRange[1] &&
        departureMinutes >= filters.departureTimeRange[0] &&
        departureMinutes <= filters.departureTimeRange[1] &&
        (filters.busTypes.length === 0 || filters.busTypes.includes(bus.busType))
      );
    });

    setFilteredBuses(buses);
  }, [formData, filters]);

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'priceRange') {
        return {
          ...prev,
          [filterType]: [100, parseInt(value)] // Keep min at 100, update max
        };
      } else if (filterType === 'departureTimeRange') {
        return {
          ...prev,
          [filterType]: [0, parseInt(value)] // Keep min at 0, update max
        };
      } else if (filterType === 'busTypes') {
        return {
          ...prev,
          [filterType]: value // Handle checkbox array
        };
      }
      return prev;
    });
  };

  const handleSeatSelect = (busId, seatNumber) => {
    setSelectedSeats(prev => {
      const currentSeats = prev[busId] || new Set();
      const newSeats = new Set(currentSeats);
      const bus = allBuses.find(b => b.id === busId);
      if (bus.unavailableSeats?.includes(seatNumber)) {
        alert('This seat is unavailable.');
        return prev;
      }
      if (newSeats.has(seatNumber)) {
        newSeats.delete(seatNumber);
      } else if (newSeats.size < 6) { // Limit to 6 seats per booking
        newSeats.add(seatNumber);
      } else {
        alert('Maximum 6 seats can be selected per booking.');
        return prev;
      }
      return {
        ...prev,
        [busId]: newSeats,
      };
    });
  };

  const handleViewSeats = (bus) => {
    // Toggle seat selection view or manage state for modal
    setSelectedSeats(prev => ({
      ...prev,
      [bus.id]: prev[bus.id] || new Set(),
    }));
  };

  const renderSeatLayout = (bus) => {
    const totalSeats = bus.seats;
    const rows = Math.ceil(totalSeats / 3); // Calculate rows based on 3 seats per row
    const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

    return (
      <div className="seat-layout mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-md font-semibold mb-2">Select Seats (Max 6)</h4>
        <div className="grid grid-cols-3 gap-2">
          {seats.map(seat => (
            <button
              key={seat}
              className={`w-8 h-8 rounded ${selectedSeats[bus.id]?.has(seat) ? 'bg-green-500 text-white' : bus.unavailableSeats?.includes(seat) ? 'bg-red-500 text-white cursor-not-allowed' : 'bg-gray-300'} border`}
              onClick={() => handleSeatSelect(bus.id, seat)}
              disabled={selectedSeats[bus.id]?.size >= 6 || bus.unavailableSeats?.includes(seat)}
            >
              {seat}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm">Selected Seats: {Array.from(selectedSeats[bus.id] || []).join(', ') || 'None'}</p>
        <button
          className="btn-view-seats mt-2"
          onClick={() => {
            const selected = Array.from(selectedSeats[bus.id] || []);
            if (selected.length > 0 && selected.some(seat => bus.unavailableSeats?.includes(seat))) {
              alert('Cannot book unavailable seats.');
            } else {
              alert(`Booked seats ${selected.join(', ')} for ${bus.route}`);
              setSelectedSeats(prev => ({ ...prev, [bus.id]: new Set() })); // Reset after booking
            }
          }}
          disabled={!selectedSeats[bus.id]?.size || selectedSeats[bus.id]?.some(seat => bus.unavailableSeats?.includes(seat))}
        >
          Confirm Booking
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Filter</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">Fare Range: Rs {filters.priceRange[0]} - Rs {filters.priceRange[1]}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Departure Time</label>
                <input
                  type="range"
                  min="0"
                  max="2359"
                  value={filters.departureTimeRange[1]}
                  onChange={(e) => handleFilterChange('departureTimeRange', e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">Departure Time: 00:00 - {Math.floor(filters.departureTimeRange[1] / 60)}:{filters.departureTimeRange[1] % 60}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Bus Type</label>
                <div className="space-y-2">
                  {['AIR CONDITIONED', 'AC SLEEPER', 'AC SLEEPER SEATER', 'AC 3X2', 'DELUXE 3X2', 'NON AC SLEEPER SEATER', 'NON AC SLEEPER', 'NON AC LOWER BERTH SEATER', 'AC LOWER BERTH SEATER', 'ULTRA DELUXE'].map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={type}
                        checked={filters.busTypes.includes(type)}
                        onChange={(e) => handleFilterChange('busTypes', e.target.checked ? [...filters.busTypes, type] : filters.busTypes.filter(t => t !== type))}
                        className="mr-2 checked:bg-green-500 checked:border-transparent"
                      />
                      <label htmlFor={type} className="text-gray-700">{type}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bus List */}
          <div className="w-full md:w-3/4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{formData.fromPlace} → {formData.toPlace}</h2>
                <p className="text-sm text-gray-600 mt-2 md:mt-0">Journey date {formData.onwardDate}</p>
              </div>
              <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 border-b pb-2">
                <span>Corporation</span>
                <span>Departure</span>
                <span>Duration</span>
                <span>Arrival</span>
                <span>Price</span>
              </div>
              {filteredBuses.map((bus, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 border-b">
                  <div>
                    <span className="block md:hidden font-medium text-gray-500">Corporation:</span>
                    {bus.corporation} <br /> {bus.busType} <br /> {bus.id}
                  </div>
                  <div>
                    <span className="block md:hidden font-medium text-gray-500">Departure:</span>
                    {bus.departure} <br /> {bus.route}
                  </div>
                  <div>
                    <span className="block md:hidden font-medium text-gray-500">Duration:</span>
                    {bus.duration}
                  </div>
                  <div>
                    <span className="block md:hidden font-medium text-gray-500">Arrival:</span>
                    {bus.arrival} <br /> {bus.via}
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="block md:hidden font-medium text-gray-500">Price:</span>
                    {Array.isArray(bus.price) ? `Rs ${bus.price[0]}/${bus.price[1]}` : `Rs ${bus.price}`} <br />
                    {bus.seats} Seats Available
                    <button
                      className="btn-view-seats mt-2"
                      onClick={() => handleViewSeats(bus)}
                    >
                      VIEW SEATS
                    </button>
                    {selectedSeats[bus.id] && renderSeatLayout(bus)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FetchBus;