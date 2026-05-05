import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Relative URLs — requests go to localhost:5173 and Vite proxies them to localhost:8000.
// Frontend and backend are now the same origin, so cookies work perfectly.
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

/**
 * Fetch the CSRF cookie before any mutating request (login / register).
 * Laravel sets XSRF-TOKEN; axios reads it and sends X-XSRF-TOKEN automatically.
 */
export const initCsrf = (): Promise<void> =>
  axios
    .get('/sanctum/csrf-cookie', { withCredentials: true })
    .then(() => undefined);

export default apiClient;
