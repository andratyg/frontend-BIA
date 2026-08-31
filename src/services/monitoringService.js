import apiClient from './apiClient';

/**
 * Ambil device_id user yang sedang login dari localStorage.
 * Fallback ke 1 jika belum ada device yang di-connect.
 */
export const getCurrentDeviceId = () => {
  const userId = localStorage.getItem('user_id') || 'default';
  const deviceId = localStorage.getItem(`device_id_${userId}`);
  if (deviceId) return deviceId;
  return '1'; // fallback default
};

/**
 * Mengambil data monitoring/sensor berdasarkan device ID user yang login.
 * Endpoint: GET /sensor/{deviceId}
 *
 * @param {string|number|null} deviceId - Jika null, ambil dari localStorage user
 */
export const getSensorData = async (deviceId = null) => {
  const id = deviceId || getCurrentDeviceId();
  const response = await apiClient.get(`/sensor/${id}`);
  return response.data;
};

/**
 * Mengambil data sensor secara real-time (untuk polling).
 * @param {string|number|null} deviceId - ID sensor (default dari localStorage)
 */
export const getSensorDataById = (deviceId = null) => {
  const id = deviceId || getCurrentDeviceId();
  return apiClient.get(`/sensor/${id}`).then(res => res.data);
};
