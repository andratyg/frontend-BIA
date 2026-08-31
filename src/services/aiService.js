import apiClient from './apiClient';

/**
 * Membangun prompt AI yang dinamis berdasarkan data tanaman dan monitoring.
 * @param {object} plant - Data tanaman (id, name, type, location, plantingDate)
 * @param {object} monitoring - Data sensor (suhu, kelembapan_udara, kelembapan_tanah)
 * @returns {string} Prompt teks untuk dikirim ke backend AI
 */
export const buildPlantAnalysisPrompt = ({ plant, monitoring }) => {
  const plantTypeLabel = {
    general: 'Umum / General',
    cabe: 'Cabai (Cabe)',
    padi: 'Padi'
  }[plant?.type] || 'Umum';

  const plantingInfo = plant?.plantingDate
    ? `\nTanggal Tanam: ${new Date(plant.plantingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : '';

  const locationInfo = plant?.location ? `\nLokasi: ${plant.location}` : '';

  const sensorInfo = monitoring
    ? `
Data Sensor Saat Ini:
- Suhu: ${monitoring.suhu ?? '-'}°C
- Kelembapan Udara: ${monitoring.kelembapan_udara ?? '-'}%
- Kelembapan Tanah: ${monitoring.kelembapan_tanah ?? '-'}%`
    : '\n(Data sensor tidak tersedia)';

  const typeGuidance = {
    cabe: `
Catatan Khusus untuk Cabe:
- Suhu optimal: 25–30°C
- Kelembapan udara optimal: 60–70%
- Kelembapan tanah optimal: 50–65%
- pH tanah optimal: 6.0–6.8`,
    padi: `
Catatan Khusus untuk Padi:
- Suhu optimal: 22–32°C
- Kelembapan udara optimal: 70–85%
- Membutuhkan banyak air (sawah/irigasi)
- pH tanah optimal: 5.5–6.5`,
    general: ''
  }[plant?.type] || '';

  return `Anda adalah asisten AI agrikultur yang ahli dalam perawatan tanaman Indonesia.

Analisis kondisi tanaman berikut dan berikan rekomendasi yang spesifik:

Informasi Tanaman:
- Nama: ${plant?.name ?? 'Tanaman Tidak Diketahui'}
- Jenis: ${plantTypeLabel}${locationInfo}${plantingInfo}
${sensorInfo}
${typeGuidance}

Berikan analisis dengan format:
1. Kondisi Tanaman Saat Ini
2. Kemungkinan Masalah yang Terdeteksi
3. Penyebab Utama
4. Rekomendasi Tindakan
5. Prioritas Tindakan (Segera / Normal / Pantau)

Sesuaikan analisis dengan jenis tanaman ${plantTypeLabel}.`;
};

/* ------------------------------------------------------------------ */
/* Deteksi pesan error provider AI (Gemini dkk) yang "nyelip" di       */
/* response sukses (200 OK). Backend /chat saat ini tidak mengubah     */
/* status HTTP-nya ketika Gemini gagal, jadi error hanya bisa dikenali */
/* dari isi teksnya.                                                   */
/* ------------------------------------------------------------------ */
const PROVIDER_ERROR_PATTERNS = [
  /error dari google/i,
  /exceeded your current quota/i,
  /quota exceeded/i,
  /rate.?limit/i,
  /please retry in [\d.]+s/i,
];

function extractProviderError(text) {
  if (!text || typeof text !== 'string') return null;
  const isErrorLike = PROVIDER_ERROR_PATTERNS.some((pattern) => pattern.test(text));
  if (!isErrorLike) return null;

  const isQuota = /quota/i.test(text);
  const retryMatch = text.match(/retry in ([\d.]+)s/i);
  const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;

  return { isQuota, retrySeconds, raw: text };
}

/**
 * Cek response dari /chat. Jika ternyata isinya pesan error provider
 * (bukan hasil AI yang valid), lempar Error asli supaya caller bisa
 * menangkapnya lewat try/catch biasa — bukan menganggapnya sukses.
 */
function assertValidAiResponse(data) {
  const reply = data?.reply || data?.message;
  const providerError = extractProviderError(reply);

  if (providerError) {
    const err = new Error(
      providerError.isQuota
        ? 'Kuota AI hari ini sudah habis (limit paket gratis Gemini tercapai).'
        : 'AI sedang dibatasi oleh penyedia layanan (rate limit). Coba lagi sebentar lagi.'
    );
    err.isAiProviderError = true;
    err.isQuotaError = providerError.isQuota;
    err.retrySeconds = providerError.retrySeconds;
    err.rawMessage = providerError.raw;
    throw err;
  }

  return data;
}

/**
 * Mengirim pesan ke AI backend.
 * Endpoint yang ditemukan: POST /chat → field: { message }
 * Menggunakan endpoint existing, menambahkan plant context ke message.
 */
export const sendAIMessage = async ({ message, plant, monitoring }) => {
  let finalMessage = message;

  // Jika ada data tanaman, tambahkan konteks ke pesan
  if (plant) {
    const contextHeader = `[Tanaman: ${plant.name} | Jenis: ${plant.type ?? 'general'}${plant.location ? ' | Lokasi: ' + plant.location : ''}]\n\n`;
    finalMessage = contextHeader + message;
  }

  const response = await apiClient.post('/chat', { message: finalMessage });
  return assertValidAiResponse(response.data);
};

/**
 * Mengirim analisis otomatis berbasis data sensor ke AI.
 * Menggunakan prompt yang dibangun secara dinamis dari buildPlantAnalysisPrompt.
 */
export const sendPlantAnalysis = async ({ plant, monitoring }) => {
  const prompt = buildPlantAnalysisPrompt({ plant, monitoring });
  const response = await apiClient.post('/chat', { message: prompt });
  return assertValidAiResponse(response.data);
};
