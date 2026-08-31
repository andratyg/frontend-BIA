import { API_BASE_URL } from '../config/api';

/**
 * Generate kode Arduino lengkap dengan endpoint yang disesuaikan per-device.
 *
 * @param {string|number} deviceId - ID device/sensor milik user
 * @returns {string} Kode Arduino (.ino) siap pakai
 */
export function generateArduinoCode(deviceId) {
  const serverUrl = `${API_BASE_URL}/sensor/${deviceId}`;

  return `// ============================================================
// BIA Plant Monitoring System - Arduino Code
// Device ID : ${deviceId}
// Endpoint  : ${serverUrl}
// Generated : ${new Date().toLocaleString('id-ID')}
// ============================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ---- Konfigurasi WiFi ----
const char* ssid     = "NAMA_WIFI_KAMU";
const char* password = "PASSWORD_WIFI_KAMU";

// ---- Endpoint Backend ----
const char* serverName = "${serverUrl}";

// ---- Konfigurasi Sensor DHT ----
#define DHTPIN 4        // Pin data DHT22 terhubung ke GPIO4
#define DHTTYPE DHT22   // Ganti ke DHT11 jika memakai DHT11
DHT dht(DHTPIN, DHTTYPE);

// ---- Konfigurasi Sensor Kelembapan Tanah ----
#define SOIL_PIN 34     // Pin analog sensor kelembapan tanah (ADC)
#define SOIL_DRY  3500  // Nilai ADC saat tanah kering (kalibrasi)
#define SOIL_WET  1500  // Nilai ADC saat tanah basah (kalibrasi)

// ---- Interval pengiriman data (ms) ----
const unsigned long INTERVAL = 10000; // 10 detik
unsigned long lastTime = 0;

void setup() {
  Serial.begin(115200);
  dht.begin();

  Serial.print("Menghubungkan ke WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi terhubung!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentTime = millis();
  if (currentTime - lastTime < INTERVAL) return;
  lastTime = currentTime;

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi terputus, mencoba reconnect...");
    WiFi.reconnect();
    return;
  }

  // Baca sensor DHT
  float suhu         = dht.readTemperature();
  float kelembapanUdara = dht.readHumidity();

  if (isnan(suhu) || isnan(kelembapanUdara)) {
    Serial.println("Gagal membaca sensor DHT!");
    return;
  }

  // Baca sensor tanah & konversi ke persen
  int soilRaw         = analogRead(SOIL_PIN);
  int kelembapanTanah = map(soilRaw, SOIL_DRY, SOIL_WET, 0, 100);
  kelembapanTanah     = constrain(kelembapanTanah, 0, 100);

  // Cetak ke Serial Monitor
  Serial.printf("Suhu: %.1f°C | Kelembapan Udara: %.0f%% | Kelembapan Tanah: %d%%\\n",
                suhu, kelembapanUdara, kelembapanTanah);

  // Kirim data ke backend
  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");

  // Buat payload JSON
  String payload = "{\\"suhu\\":" + String(suhu, 1) +
                   ",\\"kelembapan_udara\\":" + String(kelembapanUdara, 0) +
                   ",\\"kelembapan_tanah\\":" + String(kelembapanTanah) + "}";

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    Serial.printf("HTTP Response: %d\\n", httpResponseCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.printf("HTTP Error: %s\\n", http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}
`;
}

/**
 * Trigger download file .ino ke browser user.
 *
 * @param {string|number} deviceId - ID device/sensor
 */
export function downloadArduinoCode(deviceId) {
  const code = generateArduinoCode(deviceId);
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bia_sensor_device_${deviceId}.ino`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
