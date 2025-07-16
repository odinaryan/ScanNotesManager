import axios from 'axios';
import type { Scan, Note, CreateNoteRequest, ApiError } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
    };
    
    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

// API methods
export const scanApi = {
  // Get all scans
  getScans: async (): Promise<Scan[]> => {
    const response = await api.get<Scan[]>('/scans');
    return response.data;
  },

  // Get scan by ID
  getScanById: async (id: number): Promise<Scan> => {
    const response = await api.get<Scan>(`/scans/${id}`);
    return response.data;
  },

  // Get notes for a scan
  getNotesByScanId: async (scanId: number): Promise<Note[]> => {
    const response = await api.get<Note[]>(`/scans/${scanId}/notes`);
    return response.data;
  },

  // Add note to a scan
  addNoteToScan: async (scanId: number, note: CreateNoteRequest): Promise<Note> => {
    const response = await api.post<Note>(`/scans/${scanId}/notes`, note);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 