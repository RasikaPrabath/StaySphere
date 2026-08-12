import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Access Token from local storage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless Token Rotation on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');

        if (refreshToken) {
          // Attempt token rotation
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            accessToken,
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token expired or invalid; clear auth state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth_session_expired'));
      }
    }
    return Promise.reject(error);
  }
);

// ─── Authentication API Callers ──────────────────────────────────────────
export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  },

  register: async (email, password, firstName, lastName, phoneNumber) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    });
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// ─── Hotel Search API Callers ─────────────────────────────────────────────
export const searchApi = {
  searchHotels: async (params) => {
    const response = await apiClient.get('/search', { params });
    return response.data; // returns { items: [], totalCount: X, source: "Cache" | "Database" }
  },
};

// ─── Booking API Callers ──────────────────────────────────────────────────
export const bookingApi = {
  createBooking: async (roomId, checkInDate, checkOutDate, guestCount) => {
    const response = await apiClient.post('/bookings', {
      roomId,
      checkInDate,
      checkOutDate,
      guestCount,
    });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await apiClient.get('/bookings/my');
    return response.data;
  },
};

export default apiClient;
