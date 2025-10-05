import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../../assets/logo.png';
import chennai from '../../assets/chennai.jpg';
import bengaluru from '../../assets/benguluru.jpg';
import kumbakonam from '../../assets/kumbakonam.jpg';
import tirupati from '../../assets/tirupati.jpg';

const Home = () => {
  const [formData, setFormData] = useState({
    fromPlace: '',
    toPlace: '',
    journeyDate: new Date().toISOString().split('T')[0], // Default to current date (2025-10-05)
    returnDate: '',
    singleLady: false,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const places = ['Chennai', 'Bengaluru', 'Kumbakonam', 'Tirupati', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Vellore', 'Erode'];
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'fromPlace' || name === 'toPlace') {
      const filteredSuggestions = places.filter(place =>
        place.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value, field) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fromPlace || !formData.toPlace || !formData.journeyDate) {
      alert('Please fill in all required fields (Source, Destination, and Journey Date).');
      return;
    }
    console.log('Form submitted:', formData);
    navigate('/fetch-bus', { state: { formData } });
  };

  const handlePackageTourClick = () => {
    navigate('/second');
  };

  const handleViewTicketsClick = () => {
    navigate('/mybookings');
  };

  const handleAccountOptionClick = (option) => {
    setShowAccountDropdown(false);
    if (option === 'profile') {
      navigate('/profile');
    } else if (option === 'cancel') {
      navigate('/mybookings');
    } else if (option === 'logout') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f0fa] font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="OTRS Logo" className="h-12 w-auto" />
        </div>
        <div className="flex items-center space-x-6">
          <button className="btn-nav" onClick={handleViewTicketsClick}>View Tickets</button>
          <div className="relative">
            <button
              className="btn-nav"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              My Account
            </button>
            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAccountOptionClick('profile')}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAccountOptionClick('cancel')}
                >
                  Cancel Ticket
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAccountOptionClick('logout')}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Online Ticket Reservation System (OTRS)</h1>
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
          <div className="flex space-x-6 mb-6">
            <button className="btn-primary">Bus Booking</button>
            <button className="btn-secondary" onClick={handlePackageTourClick}>Package Tour</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Book Bus Tickets</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Source</label>
                <input
                  type="text"
                  name="fromPlace"
                  value={formData.fromPlace}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="From Place"
                  required
                />
                {suggestions.length > 0 && formData.fromPlace && (
                  <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion, 'fromPlace')}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Destination</label>
                <input
                  type="text"
                  name="toPlace"
                  value={formData.toPlace}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="To Place"
                  required
                />
                {suggestions.length > 0 && formData.toPlace && (
                  <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion, 'toPlace')}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Journey Date</label>
                <input
                  type="date"
                  name="journeyDate"
                  value={formData.journeyDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              Search Bus
            </button>
          </form>
        </div>
      </div>

      {/* Top Destinations */}
      <div className="bg-blue-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Top Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="destination-card">
            <img src={chennai} alt="Chennai" className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h3 className="text-xl font-semibold">Chennai</h3>
            <p className="text-sm">The capital city of Tamil Nadu, known for its culture...</p>
          </div>
          <div className="destination-card">
            <img src={bengaluru} alt="Bengaluru" className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h3 className="text-xl font-semibold">Bengaluru</h3>
            <p className="text-sm">The tech hub of Karnataka with vibrant nightlife...</p>
          </div>
          <div className="destination-card">
            <img src={kumbakonam} alt="Kumbakonam" className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h3 className="text-xl font-semibold">Kumbakonam</h3>
            <p className="text-sm">A historic city in Thanjavur district...</p>
          </div>
          <div className="destination-card">
            <img src={tirupati} alt="Tirupati" className="w-full h-40 object-cover rounded-t-lg mb-4" />
            <h3 className="text-xl font-semibold">Tirupati</h3>
            <p className="text-sm">A city in Andhra Pradesh, home to Tirumala Temple...</p>
          </div>
        </div>
      </div>

      {/* Our Growing Numbers */}
      <div className="bg-white p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Our Growing Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://img.icons8.com/ios-filled/50/00C853/android.png" alt="Android" className="mx-auto mb-2" />
            <p className="text-lg font-medium">Downloaded</p>
            <p className="text-2xl font-bold text-green-600">29,09,647+</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://img.icons8.com/ios-filled/50/000000/mac-logo.png" alt="iOS" className="mx-auto mb-2" />
            <p className="text-lg font-medium">Downloaded</p>
            <p className="text-2xl font-bold text-gray-800">2,24,812+</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src="https://img.icons8.com/ios-filled/50/000000/visitor.png" alt="Visitors" className="mx-auto mb-2" />
            <p className="text-lg font-medium">Visitors</p>
            <p className="text-2xl font-bold text-blue-600">256280813</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-6 text-center">
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <h3 className="font-bold mb-2">About Us</h3>
            <ul className="text-sm">
              <li>Information</li>
              <li>Rules & Regulations</li>
              <li>Reservation Center</li>
              <li>Special Services</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Quick Links</h3>
            <ul className="text-sm">
              <li>Counter Address</li>
              <li>Compatible Browsers</li>
              <li>Browser Settings</li>
              <li>Terms And Conditions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">General Info</h3>
            <ul className="text-sm">
              <li>FAQs</li>
              <li>Privacy Policy</li>
              <li>Site Map</li>
              <li>Contact Us</li>
              <li>Feed Back</li>
            </ul>
          </div>
        </div>
        <div className="text-sm">
          <p>Online Reservation Toll Free Number: <span className="font-bold">08066006572 / 9513948001</span></p>
          <p>Email: <span className="font-bold">commercial@tnstc.org / pctsorts@gmail.com</span></p>
          <p>Bank Queries/Billdesk / Helpline: <span className="font-bold">044-49076316 / 49076326</span></p>
          <p>Email: <span className="font-bold">support@billdesk.com</span></p>
          <p>Basispay payment Gateway(24/7) Helpline: <span className="font-bold">7305068045</span></p>
          <p>Email: <span className="font-bold">support@basispay.in</span></p>
          <p>WhatsApp No: <span className="font-bold">9445014448</span></p>
          <p>Powered by: <a href="https://www.radianinfo.com" className="underline">www.radianinfo.com</a></p>
        </div>
        <p className="text-xs mt-4">© TNSTC. All Rights Reserved. Ver:251005-1528</p>
      </footer>
    </div>
  );
};

export default Home;