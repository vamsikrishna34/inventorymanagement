import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Uses proxy in dev, env var in prod
  headers: { 'Content-Type': 'application/json' }
});

export default api;