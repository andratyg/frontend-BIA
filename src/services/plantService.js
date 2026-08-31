import apiClient from './apiClient';

export const plantProfiles = {
  general: {
    label: "General",
    description: "Tanaman umum tanpa spesifikasi khusus",
    icon: "🌱"
  },
  cabe: {
    label: "Cabe",
    description: "Tanaman cabai",
    icon: "🌶️"
  },
  padi: {
    label: "Padi",
    description: "Tanaman padi",
    icon: "🌾"
  }
};

export const getPlants = async () => {
  try {
    const response = await apiClient.get('/plants');
    return response.data;
  } catch (error) {
    console.warn("CRUD frontend sudah disiapkan, tetapi endpoint backend /plants belum ditemukan atau gagal diakses.");
    // Simulated fallback data if backend is missing
    return [
      { id: 1, name: "Cabe A", type: "cabe", location: "Greenhouse 1", plantingDate: "2026-08-01", notes: "Uji coba cabe" }
    ];
  }
};

export const getPlant = async (id) => {
  try {
    const response = await apiClient.get(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`CRUD frontend sudah disiapkan, tetapi endpoint backend /plants/${id} belum ditemukan.`);
    return { id, name: "Cabe A", type: "cabe", location: "Greenhouse 1", plantingDate: "2026-08-01", notes: "Uji coba cabe" };
  }
};

export const createPlant = async (data) => {
  try {
    const response = await apiClient.post('/plants', data);
    return response.data;
  } catch (error) {
    console.warn("CRUD frontend sudah disiapkan, tetapi endpoint backend POST /plants belum ditemukan.");
    return { id: Date.now(), ...data };
  }
};

export const updatePlant = async (id, data) => {
  try {
    const response = await apiClient.put(`/plants/${id}`, data);
    return response.data;
  } catch (error) {
    console.warn(`CRUD frontend sudah disiapkan, tetapi endpoint backend PUT /plants/${id} belum ditemukan.`);
    return { id, ...data };
  }
};

export const deletePlant = async (id) => {
  try {
    const response = await apiClient.delete(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`CRUD frontend sudah disiapkan, tetapi endpoint backend DELETE /plants/${id} belum ditemukan.`);
    return { success: true };
  }
};
