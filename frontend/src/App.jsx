import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, useLocation } from 'react-router-dom';

import DummyPage from './pages/DummyPage/DummyPage';
import Navbar from './components/navbar/navbar';

import Login from './pages/login/login';
import Register from './pages/register/register';
import Home from './pages/Home/Home'; 
import FetchBus from './pages/fetchbus/fetchbus'; // Updated component import
import PaymentPage from './pages/payment/payment';
import MyBookings from './pages/mybooking/mybooking';
import TourPackages from './packages/packages';
import Second from './pages/Second/Second';

function App() {
  const location = useLocation();
  const hideNavbarOn = ['/', '/register']; // routes where Navbar shouldn't show

  return (
    <>
      <ToastContainer />
      {!hideNavbarOn.includes(location.pathname)}

      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/second" element={<Second />} /> 
          <Route path="/fetch-bus" element={<FetchBus />} /> {/* Updated route */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/packages" element={<TourPackages />} />
          <Route path="/dummy" element={<DummyPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;