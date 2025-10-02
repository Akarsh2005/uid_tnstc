import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SeatSelectionModal from '../../components/SeatSelectionModal/SeatSelectionModal';
import './second.css';

const Second = () => {
  const navigate = useNavigate();
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(null);
  const [journeyDates, setJourneyDates] = useState({});

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const packages = [
    {
      id: 1,
      title: 'Kumbakonam Navagraha Package',
      note: 'Tour will be conducted on all days from 25th March 2024 onwards.',
      tours: [
        {
          slNo: 1,
          routeDetail: 'Thingalur, Alangudi, Thirunageswaram, Suriyanarkoil, Kanjanur, Vaitheeswarankoil, Keelaperumpallam, Thiruvenkadu, Tirunallar',
          startingPoint: 'KUMBAKONAM [DELUXE 3x2]',
          time: '05:00 Hrs [All Days]',
          fare: 740,
        },
        {
          slNo: 2,
          routeDetail: 'Thingalur, Alangudi, Thirunageswaram, Suriyanarkoil, Kanjanur, Vaitheeswarankoil, Keelaperumpallam, Thiruvenkadu',
          startingPoint: 'KUMBAKONAM [AC BUS]',
          time: '05:15 Hrs [Thursday & Sunday]',
          fare: 1274,
        },
      ],
    },
    {
      id: 2,
      title: 'Kanchipuram Package Trip',
      note: 'From 27-08-2024 Onwards Daily',
      tours: [
        {
          slNo: 1,
          routeDetail: 'Varadaraja Perumal Temple, Kanchipuram, Sri Kanchi Kamakshi Amman Temple, Kanchipuram, Ekambaranathar Temple, Kanchipuram, Guru Bagavan Temple, Govindavadi, Arulmigu Subramaniam Swamy Temple',
          startingPoint: 'Kanchipuram Busstand',
          time: '07:00 Hrs',
          fare: 650,
        },
        {
          slNo: 2,
          routeDetail: 'Sri Devaraja Perumal Temple, Kanchipuram, Sri Deva Sivalayam, Thiruvallangadu, Veeraragava Perumal Temple, Thiruvallur',
          startingPoint: 'Kanchipuram Busstand',
          time: '07:00 Hrs',
          fare: 650,
        },
      ],
    },
  ];

  const handleBookNow = (tour, pkgTitle) => {
    if (!journeyDates[tour.slNo]) {
      alert('Please select a journey date.');
      return;
    }
    setSelectedTour({ tour, pkgTitle });
    setShowModal(true);
  };

  const handleConfirmBooking = (tourDetails, numberOfPersons, totalPrice, journeyDate) => {
    navigate('/payment', {
      state: {
        tourDetails: {
          title: tourDetails.pkgTitle,
          route: tourDetails.tour.routeDetail,
          startingPoint: tourDetails.tour.startingPoint,
          time: tourDetails.tour.time,
          fare: tourDetails.tour.fare,
        },
        numberOfPersons,
        totalPrice,
        journeyDate,
      },
    });
    setShowModal(false);
  };

  const handleDateChange = (tourId, value) => {
    setJourneyDates((prev) => ({
      ...prev,
      [tourId]: value || defaultDate,
    }));
  };

  const handleShowRoute = (routeDetail) => {
    setShowRouteModal(routeDetail);
  };

  return (
    <div className="tour-container">
      <div className="tour-demo-banner">
        This is a demo. Bookings are stored locally.
      </div>
      <div className="tour-content">
        <div className="tour-header">
          <h1 className="tour-title">Package Tour Details</h1>
          <Link to="/home" className="tour-home-button" aria-label="Back to Home">
            Back to Home
          </Link>
        </div>
        {packages.map((pkg) => (
          <div key={pkg.id} className="tour-package">
            <h2 className="tour-package-title">{pkg.title}</h2>
            <p className="tour-package-note">{pkg.note}</p>
            <div className="tour-table-container">
              <table className="tour-table" role="grid">
                <thead>
                  <tr>
                    <th scope="col">Sl. No.</th>
                    <th scope="col">Route Detail</th>
                    <th scope="col">Starting Point</th>
                    <th scope="col">Time</th>
                    <th scope="col">Fare</th>
                    <th scope="col">Journey Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.tours.map((tour) => (
                    <tr key={tour.slNo} className="tour-table-row">
                      <td>{tour.slNo}</td>
                      <td className="tour-route">
                        <span className="tour-route-text">
                          {tour.routeDetail.length > 50
                            ? `${tour.routeDetail.slice(0, 50)}...`
                            : tour.routeDetail}
                        </span>
                        {tour.routeDetail.length > 50 && (
                          <button
                            className="tour-route-button"
                            onClick={() => handleShowRoute(tour.routeDetail)}
                            aria-label={`Show full route for tour ${tour.slNo}`}
                          >
                            Show More
                          </button>
                        )}
                      </td>
                      <td>{tour.startingPoint}</td>
                      <td>{tour.time}</td>
                      <td>Rs {tour.fare}</td>
                      <td>
                        <input
                          type="date"
                          value={journeyDates[tour.slNo] || defaultDate}
                          onChange={(e) => handleDateChange(tour.slNo, e.target.value)}
                          className="tour-date-input"
                          aria-label={`Select journey date for tour ${tour.slNo}`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </td>
                      <td>
                        <button
                          className="tour-book-button"
                          onClick={() => handleBookNow(tour, pkg.title)}
                          aria-label={`Book tour ${tour.slNo} - ${pkg.title}`}
                        >
                          Book Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <SeatSelectionModal
          tour={selectedTour}
          onClose={() => setShowModal(false)}
          onConfirmBooking={handleConfirmBooking}
          formData={{ journeyDate: journeyDates[selectedTour.tour.slNo] }}
        />
      )}
      {showRouteModal && (
        <div className="tour-route-modal" role="dialog" aria-modal="true">
          <div className="tour-route-modal-content">
            <h3 className="tour-route-modal-title">Full Route Details</h3>
            <p className="tour-route-modal-text">{showRouteModal}</p>
            <button
              className="tour-route-modal-close"
              onClick={() => setShowRouteModal(null)}
              aria-label="Close route details modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Second;