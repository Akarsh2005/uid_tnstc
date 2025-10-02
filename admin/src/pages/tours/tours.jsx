import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    duration: '1 Day',
    places: '',
    fare: '',
    seats: '',
    departureTime: '',
    returnTime: ''
  });
  const [editId, setEditId] = useState(null);

  const API = 'http://localhost:5001/api/tours';

  const fetchTours = async () => {
    try {
      const res = await axios.get(API);
      setTours(res.data);
    } catch (err) {
      console.error('Error fetching tours:', err.message);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      places: formData.places.split(',').map(p => p.trim())
    };

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, data);
        setEditId(null);
      } else {
        await axios.post(API, data);
      }

      setFormData({
        title: '',
        duration: '1 Day',
        places: '',
        fare: '',
        seats: '',
        departureTime: '',
        returnTime: ''
      });

      fetchTours();
    } catch (err) {
      console.error('Error saving tour:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTours();
    } catch (err) {
      console.error('Failed to delete tour:', err.message);
    }
  };

  const handleEdit = (tour) => {
    setEditId(tour._id);
    setFormData({
      title: tour.title,
      duration: tour.duration,
      places: tour.places.join(', '),
      fare: tour.fare,
      seats: tour.seats,
      departureTime: tour.departureTime,
      returnTime: tour.returnTime
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Tour Packages</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
        <select value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}>
          <option value="1 Day">1 Day</option>
          <option value="2 Days">2 Days</option>
          <option value="3 Days">3 Days</option>
        </select>
        <input type="text" placeholder="Places (comma separated)" value={formData.places} onChange={e => setFormData({ ...formData, places: e.target.value })} required />
        <input type="number" placeholder="Fare" value={formData.fare} onChange={e => setFormData({ ...formData, fare: e.target.value })} required />
        <input type="number" placeholder="Seats" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} required />
        <input type="text" placeholder="Departure Time" value={formData.departureTime} onChange={e => setFormData({ ...formData, departureTime: e.target.value })} />
        <input type="text" placeholder="Return Time" value={formData.returnTime} onChange={e => setFormData({ ...formData, returnTime: e.target.value })} />
        <button type="submit">{editId ? 'Update' : 'Add'} Tour</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration</th>
            <th>Places</th>
            <th>Fare</th>
            <th>Seats</th>
            <th>Booked</th>
            <th>Departure</th>
            <th>Return</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour._id}>
              <td>{tour.title}</td>
              <td>{tour.duration}</td>
              <td>{tour.places.join(', ')}</td>
              <td>{tour.fare}</td>
              <td>{tour.seats}</td>
              <td>{tour.bookedSeats.length}</td>
              <td>{tour.departureTime}</td>
              <td>{tour.returnTime}</td>
              <td>
                <button onClick={() => handleEdit(tour)}>Edit</button>
                <button onClick={() => handleDelete(tour._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tours;
