import React from 'react';
import './Second.css'; // Assuming a separate CSS file for styling

const Second = () => {
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
          fare: 'Rs.740',
        },
        {
          slNo: 2,
          routeDetail: 'Thingalur, Alangudi, Thirunageswaram, Suriyanarkoil, Kanjanur, Vaitheeswarankoil, Keelaperumpallam, Thiruvenkadu',
          startingPoint: 'KUMBAKONAM [AC BUS]',
          time: '05:15 Hrs [Thursday & Sunday]',
          fare: 'Rs.1274',
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
          fare: 'Rs.650',
        },
        {
          slNo: 2,
          routeDetail: 'Sri Devaraja Perumal Temple, Kanchipuram, Sri Deva Sivalayam, Thiruvallangadu, Veeraragava Perumal Temple, Thiruvallur',
          startingPoint: 'Kanchipuram Busstand',
          time: '07:00 Hrs',
          fare: 'Rs.650',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">Package Tour Details</h1>
      {packages.map((pkg) => (
        <div key={pkg.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{pkg.title}</h2>
          <p className="text-gray-600 mb-4">{pkg.note}</p>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border-b-2 border-gray-300 p-3">Sl. No.</th>
                <th className="border-b-2 border-gray-300 p-3">Route Detail</th>
                <th className="border-b-2 border-gray-300 p-3">Starting Point</th>
                <th className="border-b-2 border-gray-300 p-3">Time</th>
                <th className="border-b-2 border-gray-300 p-3">Fare</th>
                <th className="border-b-2 border-gray-300 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {pkg.tours.map((tour) => (
                <tr key={tour.slNo} className="hover:bg-gray-50">
                  <td className="border-b p-3">{tour.slNo}</td>
                  <td className="border-b p-3">{tour.routeDetail}</td>
                  <td className="border-b p-3">{tour.startingPoint}</td>
                  <td className="border-b p-3">{tour.time}</td>
                  <td className="border-b p-3">{tour.fare}</td>
                  <td className="border-b p-3">
                    <button className="btn-primary">Book Now</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Second;