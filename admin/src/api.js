// src/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // adjust if needed
});

export default instance;
