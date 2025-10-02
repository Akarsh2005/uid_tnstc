// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Home from './pages/home/home';  // ✅ Capitalize path
import Bus from './pages/bus/bus';
import Tours from './pages/tours/tours';
import DummyPage from './pages/DummyPage/DummyPage';
import Booking from './pages/booking/booking';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buses" element={<Bus />} />
        <Route path="/dummy" element={<DummyPage />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/bookings" element={<Booking />} />
        
      </Routes>
    </>
  );
}

export default App;
