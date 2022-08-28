import axios from 'axios';

export const remote = axios.create({
  baseURL: '/api',
});

export const credentialRemote = axios.create({
  baseURL: '/api',
  withCredentials: true,
});
