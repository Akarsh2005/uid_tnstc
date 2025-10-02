import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Bus = () => {
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busName: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    fare: '',
    seats: '',
    travelDate: ''
  });
  const [editId, setEditId] = useState(null);

  const baseURL = 'http://localhost:5001/api/buses';

  // Fetch all buses
  const fetchBuses = async () => {
    try {
      const res = await axios.get(baseURL);
      setBuses(res.data);
    } catch (err) {
      console.error('Failed to load buses:', err.message);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Add or update a bus
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };

      if (editId) {
        await axios.put(`${baseURL}/${editId}`, formData, config);
        setEditId(null);
      } else {
        await axios.post(baseURL, formData, config);
      }

      // Reset form
      setFormData({
        busName: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        fare: '',
        seats: '',
        travelDate: ''
      });

      fetchBuses();
    } catch (err) {
      console.error('Error saving bus:', err.message);
      alert('Failed to save bus. Check console for error.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchBuses();
    } catch (err) {
      console.error('Failed to delete bus:', err.message);
    }
  };

  const handleEdit = (bus) => {
    setEditId(bus._id);
    setFormData({
      busName: bus.busName,
      source: bus.source,
      destination: bus.destination,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      fare: bus.fare,
      seats: bus.seats,
      travelDate: bus.travelDate
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Buses</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input type="text" placeholder="Bus Name" value={formData.busName} onChange={e => setFormData({ ...formData, busName: e.target.value })} required />
        <input type="text" placeholder="Source" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} required />
        <input type="text" placeholder="Destination" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} required />
        <input type="text" placeholder="Departure Time" value={formData.departureTime} onChange={e => setFormData({ ...formData, departureTime: e.target.value })} required />
        <input type="text" placeholder="Arrival Time" value={formData.arrivalTime} onChange={e => setFormData({ ...formData, arrivalTime: e.target.value })} required />
        <input type="number" placeholder="Fare" value={formData.fare} onChange={e => setFormData({ ...formData, fare: e.target.value })} required />
        <input type="number" placeholder="Seats" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} required />
        <input type="date" placeholder="Travel Date" value={formData.travelDate} onChange={e => setFormData({ ...formData, travelDate: e.target.value })} required />

        <button type="submit">{editId ? 'Update' : 'Create'} Bus</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Bus Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Fare</th>
            <th>Seats</th>
            <th>Date</th>
            <th>Actions</th>
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
              <td>{bus.travelDate}</td>
              <td>
                <button onClick={() => handleEdit(bus)}>Edit</button>
                <button onClick={() => handleDelete(bus._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bus;
