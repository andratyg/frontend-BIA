import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaThermometerHalf, FaTint, FaSeedling, FaSave, FaUndo, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

import Swal from 'sweetalert2';

function ThresholdSettings() {
  const { getThresholds, saveThresholds } = useAuth();
  const [thresholds, setThresholds] = useState(getThresholds());
  const [saved, setSaved] = useState(false);

  // Update local state ketika context berubah
  useEffect(() => {
    setThresholds(getThresholds());
  }, [getThresholds]);

  const handleChange = (category, key, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setThresholds(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: num,
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    saveThresholds(thresholds);
    setSaved(true);
    Swal.fire({
      title: 'Berhasil Disimpan!',
      text: 'Pengaturan threshold berhasil diperbarui.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-3xl p-6' }
    });
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Reset Pengaturan?',
      text: 'Nilai threshold akan dikembalikan ke pengaturan awal.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
          popup: 'rounded-3xl p-6',
          confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl mx-2 shadow-md',
          cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl mx-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const defaults = {
          suhu: { dingin: 20, panas: 33 },
          kelembapanUdara: { kering: 40, tinggi: 80 },
          kelembapanTanah: { kering: 40, basah: 70 },
        };
        setThresholds(defaults);
        setSaved(false);
        Swal.fire({
          title: 'Direset!',
          text: 'Pengaturan berhasil direset ke nilai awal.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-3xl p-6' }
        });
      }
    });
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-green-400 outline-none transition';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FaThermometerHalf className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Setting Threshold</h1>
              <p className="text-green-100 text-sm mt-0.5">
                Atur batas kondisi sensor untuk status badge di dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          <FaInfoCircle className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p>
            Nilai threshold ini menentukan label status (Dingin/Normal/Panas, Kering/Normal/Tinggi, dll)
            yang ditampilkan di dashboard. Disimpan per-akun di browser kamu.
          </p>
        </div>

        {/* -------- Suhu -------- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
            <FaThermometerHalf className="text-red-400" />
            Suhu (°C)
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Dingin → Normal → Panas
          </p>

          {/* Visual range preview */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">Dingin &lt; {thresholds.suhu.dingin}°C</span>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-full font-medium">Normal</span>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full font-medium">Panas &gt; {thresholds.suhu.panas}°C</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batas Dingin (maks)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds.suhu.dingin}
                  onChange={(e) => handleChange('suhu', 'dingin', e.target.value)}
                  className={inputClass}
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">°C</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Suhu &lt; nilai ini → "Dingin"</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batas Panas (min)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds.suhu.panas}
                  onChange={(e) => handleChange('suhu', 'panas', e.target.value)}
                  className={inputClass}
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">°C</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Suhu &gt; nilai ini → "Panas"</p>
            </div>
          </div>
        </div>

        {/* -------- Kelembapan Udara -------- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
            <FaTint className="text-blue-400" />
            Kelembapan Udara (%)
          </h2>
          <p className="text-xs text-gray-400 mb-4">Kering → Normal → Tinggi</p>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="px-2.5 py-1 bg-yellow-100 text-yellow-600 rounded-full font-medium">Kering &lt; {thresholds.kelembapanUdara.kering}%</span>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-full font-medium">Normal</span>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">Tinggi &gt; {thresholds.kelembapanUdara.tinggi}%</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batas Kering (maks)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds.kelembapanUdara.kering}
                  onChange={(e) => handleChange('kelembapanUdara', 'kering', e.target.value)}
                  className={inputClass}
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batas Tinggi (min)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds.kelembapanUdara.tinggi}
                  onChange={(e) => handleChange('kelembapanUdara', 'tinggi', e.target.value)}
                  className={inputClass}
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* -------- Kelembapan Tanah -------- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
            <FaSeedling className="text-amber-400" />
            Kelembapan Tanah (%)
          </h2>
          <p className="text-xs text-gray-400 mb-4">Kering → Lembap → Basah</p>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="px-2.5 py-1 bg-yellow-100 text-yellow-600 rounded-full font-medium">Kering &lt; {thresholds.kelembapanTanah.kering}%</span>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-full font-medium">Lembap</span>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="px-2.5 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">Basah &gt; {thresholds.kelembapanTanah.basah}%</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batas Kering (maks)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds.kelembapanTanah.kering}
                  onChange={(e) => handleChange('kelembapanTanah', 'kering', e.target.value)}
                  className={inputClass}
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Batas Basah (min)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholds.kelembapanTanah.basah}
                  onChange={(e) => handleChange('kelembapanTanah', 'basah', e.target.value)}
                  className={inputClass}
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition"
          >
            <FaUndo />
            Reset Default
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition ${
              saved ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {saved ? <FaCheckCircle /> : <FaSave />}
            {saved ? 'Tersimpan!' : 'Simpan Pengaturan'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ThresholdSettings;
