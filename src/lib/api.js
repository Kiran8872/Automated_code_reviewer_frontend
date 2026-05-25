import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE) || '/api';

export const apiClient = axios.create({ baseURL });

export async function reviewCode({ code, language, reviewType }) {
  const res = await apiClient.post('/review-code', { code, language, reviewType });
  return res.data; // expected to match Review shape
}

export async function uploadCode(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await apiClient.post('/upload-code', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data; // expected { content, language }
}

export async function getHealth() {
  const res = await apiClient.get('/health');
  return res.data; // expected HealthResponse
}

export async function getAnalytics(days = 14) {
  const res = await apiClient.get(`/analytics?days=${days}`);
  return res.data; // expected AnalyticsResponse
}

export default apiClient;
