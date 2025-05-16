import axios from 'axios';

// This file is used to create an axios instance with a base URL and timeout settings
const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
console.log("Backend Base URL:", baseURL); // Check if it's working


const api = axios.create({
  baseURL: baseURL,
  timeout: 100000,  // optional: timeout if request takes long
});

export default api;
