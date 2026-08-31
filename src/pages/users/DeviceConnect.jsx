import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { generateArduinoCode, downloadArduinoCode } from '../../services/arduinoService';
import { getSensorData } from '../../services/monitoringService';
import {
  FaMicrochip, FaWifi, FaCheckCircle, FaTimesCircle,
  FaDownload, FaCopy, FaPlug, FaUnlink, FaInfoCircle,
  FaSync, FaTerminal
} from 'react-icons/fa';
import { MdSensors } from 'react-icons/md';

import Swal from 'sweetalert2';

function DeviceConnect() {
  const navigate = useNavigate();
  const { getDeviceId, setDeviceId, removeDeviceId, user } = useAuth();

  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [arduinoCode, setArduinoCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState(null); 
  const [testData, setTestData] = useState(null);
  const [showCode, setShowCode] = useState(false);

  // Load state device saat page mount
  useEffect(() => {
    const saved = getDeviceId();
    if (saved) {
      setConnected(true);
      setCurrentDeviceId(saved);
      setDeviceIdInput(saved);
      setArduinoCode(generateArduinoCode(saved));
    }
  }, [getDeviceId]);

  const handleConnect = () => {
    const id = deviceIdInput.trim();
    if (!id) return;

    setDeviceId(id);
    setCurrentDeviceId(id);
    setConnected(true);
    setArduinoCode(generateArduinoCode(id));
    setTestStatus(null);
    setTestData(null);
    Swal.fire({
      title: 'Device Terhubung!',
      text: `Device ID ${id} berhasil didaftarkan ke sesi Anda.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-3xl p-6' }
    });
  };

  const handleDisconnect = () => {
    Swal.fire({
      title: 'Putuskan Device?',
      text: 'Device ID ini tidak akan terhubung lagi dengan akun Anda.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Putuskan',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
          popup: 'rounded-3xl p-6',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl mx-2 shadow-md',
          cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl mx-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        removeDeviceId();
        setConnected(false);
        setCurrentDeviceId(null);
        setDeviceIdInput('');
        setArduinoCode('');
        setTestStatus(null);
        setTestData(null);
        Swal.fire({
          title: 'Device Diputus!',
          text: 'Device Anda berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-3xl p-6' }
        });
      }
    });
  };

  const handleTestConnection = async () => {
    if (!currentDeviceId) return;
    setTestStatus('loading');
    setTestData(null);
    try {
      const data = await getSensorData(currentDeviceId);
      setTestData(data);
      setTestStatus('ok');
    } catch {
      setTestStatus('error');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(arduinoCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    downloadArduinoCode(currentDeviceId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FaMicrochip className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Connect Device</h1>
              <p className="text-indigo-100 text-sm mt-0.5">
                Hubungkan Arduino/ESP32 kamu ke sistem monitoring
              </p>
            </div>
            {connected && (
              <span className="ml-auto flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                <FaWifi className="text-green-300" />
                Device Terhubung
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Panel Kiri — Connect / Status */}
          <div className="space-y-4">

            {/* Card: Device ID Input */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <MdSensors className="text-indigo-500" />
                ID Device / Sensor
              </h2>

              {connected ? (
                <div className="space-y-4">
                  {/* Status connected */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-700">Device Terhubung</p>
                      <p className="text-xs text-green-600 mt-0.5">Device ID: <span className="font-mono font-bold">{currentDeviceId}</span></p>
                    </div>
                  </div>

                  {/* Endpoint info */}
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Endpoint Sensor Aktif:</p>
                    <code className="text-xs text-indigo-600 break-all font-mono">
                      https://bia2026-production.up.railway.app/api/sensor/{currentDeviceId}
                    </code>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={testStatus === 'loading'}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-bold py-2.5 rounded-xl hover:bg-indigo-100 transition disabled:opacity-50"
                    >
                      <FaSync className={testStatus === 'loading' ? 'animate-spin' : ''} />
                      Test Koneksi
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 text-sm font-bold py-2.5 rounded-xl hover:bg-red-100 transition"
                    >
                      <FaUnlink />
                      Disconnect
                    </button>
                  </div>

                  {/* Test result */}
                  {testStatus === 'ok' && testData && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                        <FaCheckCircle /> Koneksi Berhasil!
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-xs text-gray-500">Suhu</p>
                          <p className="text-sm font-bold text-red-500">{testData.suhu?.toFixed(1)}°C</p>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-xs text-gray-500">Udara</p>
                          <p className="text-sm font-bold text-blue-500">{testData.kelembapan_udara?.toFixed(0)}%</p>
                        </div>
                        <div className="bg-white rounded-lg p-2">
                          <p className="text-xs text-gray-500">Tanah</p>
                          <p className="text-sm font-bold text-amber-500">{testData.kelembapan_tanah?.toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {testStatus === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                      <FaTimesCircle className="text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-600 font-medium">
                        Gagal terhubung. Pastikan Arduino menyala dan telah mengirim data ke endpoint.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaInfoCircle className="text-indigo-400" />
                    Masukkan Device ID yang akan digunakan untuk endpoint sensor kamu.
                  </p>
                  <input
                    type="number"
                    min="1"
                    value={deviceIdInput}
                    onChange={(e) => setDeviceIdInput(e.target.value)}
                    placeholder="Contoh: 1, 2, 3, ..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-400 outline-none transition"
                  />
                  <button
                    onClick={handleConnect}
                    disabled={!deviceIdInput.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaPlug />
                    Connect Device
                  </button>
                </div>
              )}
            </div>

            {/* Card: Cara Penggunaan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FaInfoCircle className="text-indigo-400" />
                Cara Penggunaan
              </h2>
              <ol className="space-y-2 text-xs text-gray-600">
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                  Masukkan Device ID (angka unik untuk alat Arduino/ESP32 kamu)
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                  Klik "Connect Device" — endpoint otomatis ter-generate
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                  Download atau copy kode Arduino yang telah di-generate
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                  Upload kode ke board Arduino/ESP32 kamu
                </li>
                <li className="flex gap-2">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">5</span>
                  Klik "Test Koneksi" untuk verifikasi data sudah masuk
                </li>
              </ol>
            </div>
          </div>

          {/* Panel Kanan — Arduino Code */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FaTerminal className="text-indigo-500" />
                Kode Arduino
                {currentDeviceId && (
                  <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full font-mono">
                    Device #{currentDeviceId}
                  </span>
                )}
              </h2>
              {arduinoCode && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition"
                  >
                    <FaCopy />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    <FaDownload />
                    Download .ino
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto">
              {arduinoCode ? (
                <pre className="text-xs font-mono text-gray-700 p-6 whitespace-pre-wrap leading-relaxed bg-gray-900 text-green-400 h-full min-h-[400px]">
                  {arduinoCode}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <FaMicrochip className="text-4xl text-gray-300 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">
                    Belum ada device terhubung
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Connect device di panel kiri untuk mendapatkan kode Arduino
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer action */}
        {connected && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-2xl" />
              <div>
                <p className="text-sm font-bold text-green-700">Device berhasil terhubung!</p>
                <p className="text-xs text-green-600">Dashboard sudah menggunakan data dari Device #{currentDeviceId}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition"
            >
              Ke Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeviceConnect;
