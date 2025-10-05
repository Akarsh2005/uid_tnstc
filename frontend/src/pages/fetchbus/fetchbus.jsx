import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatSelectionModal from '../../components/SeatSelectionModal/SeatSelectionModal';
import './FetchBus.css';

const FetchBus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [formData] = useState(
    state?.formData || {
      fromPlace: 'Chennai',
      toPlace: 'Salem',
      journeyDate: new Date().toISOString().split('T')[0], // Use journeyDate
      returnDate: '',
      singleLady: false,
    }
  );

  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [100, 1000],
    departureTimeRange: [0, 2359],
    busTypes: [],
  });
  const [timeError, setTimeError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  const allBuses = [
    { id: '1', corporation: 'SETC', busType: 'NON AC SLEEPER SEATER', departure: '22:15', duration: '6:00 Hrs', arrival: '04:15', price: [318, 492], seats: 34, unavailableSeats: [30, 31, 32, 33, 34], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ATHUR' },
    { id: '2', corporation: 'VILLUPURAM', busType: 'DELUXE 3X2', departure: '22:15', duration: '7:00 Hrs', arrival: '05:33', price: [274, 274], seats: 43, unavailableSeats: [40, 41, 42, 43], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-VILLUPURAM, ULUNDURPET' },
    { id: '3', corporation: 'SETC', busType: 'AC SLEEPER SEATER', departure: '22:30', duration: '6:00 Hrs', arrival: '04:30', price: [410, 631], seats: 41, unavailableSeats: [38, 39, 40, 41], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ATHUR' },
    { id: '4', corporation: 'SETC', busType: 'ULTRA DELUXE', departure: '22:45', duration: '7:30 Hrs', arrival: '04:45', price: [318, 318], seats: 37, unavailableSeats: [35, 36, 37], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ATHUR' },
    { id: '5', corporation: 'KUMBAKONAM', busType: 'AC 3X2', departure: '23:00', duration: '6:45 Hrs', arrival: '05:45', price: [350, 540], seats: 38, unavailableSeats: [36, 37, 38], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-TIRUCHY' },
    { id: '6', corporation: 'COIMBATORE', busType: 'NON AC SLEEPER', departure: '23:30', duration: '7:15 Hrs', arrival: '06:45', price: [290, 290], seats: 32, unavailableSeats: [30, 31, 32], route: 'CHENNAI KALAIIGNAR CBT - SALEM', via: 'Via-ERODE' },
  ];

  useEffect(() => {
    let buses = allBuses.filter(
      (bus) =>
        bus.route.toLowerCase().includes(formData.fromPlace.toLowerCase()) &&
        bus.route.toLowerCase().includes(formData.toPlace.toLowerCase())
    );

    buses = buses.filter((bus) => {
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
    if (filterType === 'departureTimeRange') {
      const [hours, minutes] = value.split(':').map(Number);
      const numMinutes = hours * 60 + minutes;
      if (numMinutes < 0 || numMinutes > 1439) { // 23:59 in minutes
        setTimeError('Time must be between 00:00 and 23:59');
        return;
      }
      setTimeError('');
      // Convert back to 4-digit format for consistency with original range
      const formattedValue = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
      setFilters((prev) => ({ ...prev, [filterType]: [0, parseInt(formattedValue) || 2359] }));
    } else if (filterType === 'priceRange') {
      return { ...prev, [filterType]: [100, parseInt(value) || 1000] };
    } else if (filterType === 'busTypes') {
      const newTypes = prev.busTypes.includes(value)
        ? prev.busTypes.filter((t) => t !== value)
        : [...prev.busTypes, value];
      return { ...prev, [filterType]: newTypes };
    }
    return prev;
  };

  const handleViewSeats = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBus(null);
  };

  const handleConfirmBooking = (bus, seats, totalPrice, journeyDate) => {
    console.log('Navigating to payment with:', { bus, seats, totalPrice, journeyDate }); // Debug
    if (!bus || !seats || !totalPrice || !journeyDate) {
      alert('Incomplete booking data. Please ensure all details are provided.');
      return;
    }
    navigate('/payment', {
      state: {
        busDetails: bus,
        selectedSeats: seats,
        totalPrice,
        journeyDate,
      },
    });
  };

  const uniqueBusTypes = [...new Set(allBuses.map((bus) => bus.busType))];

  if (filteredBuses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Buses Found</h2>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Back to home"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="price-range">
                Price Range (Rs)
              </label>
              <input
                id="price-range"
                type="range"
                min="100"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((filters.priceRange[1] - 100) / 900) * 100}%, #e5e7eb ${((filters.priceRange[1] - 100) / 900) * 100}%, #e5e7eb 100%)` }}
                aria-label="Adjust maximum price"
              />
              <p className="text-sm text-gray-600">Max: Rs {filters.priceRange[1]}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="departure-time">
                Departure Time (Max)
              </label>
              <input
                id="departure-time"
                type="time"
                value={formatTime(filters.departureTimeRange[1])}
                onChange={(e) => handleFilterChange('departureTimeRange', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white"
                aria-label="Adjust maximum departure time"
              />
              {timeError && <p className="text-sm text-red-500 mt-1">{timeError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bus Types</label>
              {uniqueBusTypes.map((type) => (
                <label key={type} className="bus-type-label flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={type}
                    checked={filters.busTypes.includes(type)}
                    onChange={() => handleFilterChange('busTypes', type)}
                    className="bus-type-checkbox mr-2"
                    aria-label={`Filter by bus type ${type}`}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setFilters({ priceRange: [100, 1000], departureTimeRange: [0, 2359], busTypes: [] })}
              className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mb-2"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              aria-label="Modify search criteria"
            >
              Modify Search
            </button>
          </div>
          <div className="w-full md:w-3/4">
            <div className="bg-white p-4 rounded-lg shadow-lg" role="grid">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{formData.fromPlace} → {formData.toPlace}</h2>
                <p className="text-sm text-gray-600">Journey date: {formData.journeyDate} | {filteredBuses.length} buses found</p>
              </div>
              {filteredBuses.map((bus, index) => (
                <div key={bus.id || index} className="grid grid-cols-1 md:grid-cols-6 gap-4 py-4 border-b items-center">
                  <div className="font-medium">{bus.corporation}</div>
                  <div>{bus.busType}</div>
                  <div>{bus.departure}</div>
                  <div>{bus.duration}</div>
                  <div>{bus.arrival}</div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="font-semibold">
                      {Array.isArray(bus.price) ? `Rs ${bus.price[0]} - ${bus.price[1]}` : `Rs ${bus.price}`}
                    </span>
                    <span className="text-sm text-gray-600">
                      {bus.seats - (bus.unavailableSeats?.length || 0)} Seats Available | {bus.via}
                    </span>
                    <button
                      className="btn-view-seats mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      onClick={() => handleViewSeats(bus)}
                      aria-label={`View seats for ${bus.corporation} ${bus.busType}`}
                    >
                      VIEW SEATS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <SeatSelectionModal
          bus={selectedBus}
          formData={formData}
          onClose={handleCloseModal}
          onConfirmBooking={handleConfirmBooking}
        />
      )}
    </div>
  );
};

// Helper function to format minutes to HH:MM for time input
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export default FetchBus;