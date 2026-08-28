import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaThermometerHalf,
  FaTint,
  FaSeedling,
  FaSync,
  FaChartLine,
  FaCamera,
  FaCog,
  FaCheckCircle,
  FaClock,
  FaMicrochip,
  FaDatabase,
  FaWifi,
  FaSignal,
  FaArrowUp,
  FaArrowDown,
  FaCircle,
  FaImages,
  FaHome,
  FaLeaf,
  FaTemperatureLow,
  FaWater,
  FaCloudSun,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import {
  MdDashboard,
  MdRefresh,
  MdAnalytics,
  MdSettings,
  MdSensorDoor,
  MdTimeline,
  MdWarning,
  MdCheckCircle as MdCheckCircle2
} from 'react-icons/md';
import { BsGraphUp, BsGraphDown } from 'react-icons/bs';

// Komponen Card dengan desain lebih baik
const Card = ({ children, className, style }) => (
  <div
    className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    style={style}
  >
    {children}
  </div>
);

// Fungsi pembantu untuk menentukan warna badge status
const getBadgeStyle = (status) => {
  switch (status) {
    case 'Normal':
    case 'Lembap':
      return { bg: 'bg-green-50', text: 'text-green-600', dot: 'text-green-500' };
    case 'Kering':
      return { bg: 'bg-yellow-50', text: 'text-yellow-600', dot: 'text-yellow-500' };
    case 'Panas':
    case 'Tinggi':
      return { bg: 'bg-red-50', text: 'text-red-600', dot: 'text-red-500' };
    case 'Dingin':
    case 'Basah':
      return { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'text-blue-500' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'text-gray-400' };
  }
};

// Komponen Sensor Card dengan desain premium
const SensorCard = ({ title, value, color, icon, subtitle, status, trend, iconBg }) => {
  const badgeStyle = getBadgeStyle(status);

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
        style={{ backgroundColor: color, transform: 'translate(30%, -30%)' }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: iconBg || color }}
            >
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {title}
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${badgeStyle.bg} ${badgeStyle.text}`}>
            <FaCircle className={`w-1.5 h-1.5 ${badgeStyle.dot}`} />
            {status}
          </span>
        </div>

        <div className="flex items-end gap-3">
          <h2
            className="text-4xl font-bold tracking-tight"
            style={{ color }}
          >
            {value}
          </h2>
          {subtitle && (
            <span className="text-sm text-gray-400 mb-1">{subtitle}</span>
          )}
        </div>

        {trend && (
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-sm font-medium flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
              {trend.direction === 'up' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
              {trend.value}%
            </span>
            <span className="text-xs text-gray-400">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Komponen untuk Chart sederhana
const MiniChart = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end h-8 gap-0.5 mt-2">
      {data.map((value, index) => (
        <div
          key={index}
          className="w-1.5 rounded-sm transition-all duration-300"
          style={{
            height: `${(value / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.5 + (index / data.length) * 0.5
          }}
        />
      ))}
    </div>
  );
};

function Dashboard() {
  const [suhu, setSuhu] = useState(null);
  const [kelembapanUdara, setKelembapanUdara] = useState(null);
  const [kelembapanTanah, setKelembapanTanah] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const navigate = useNavigate();

  const getData = () => {
    fetch("https://bia2026-production.up.railway.app/api/sensor/1")
      .then((res) => res.json())
      .then((data) => {
        const newData = {
          suhu: data.suhu || 0,
          kelembapanUdara: data.kelembapan_udara || 0,
          kelembapanTanah: data.kelembapan_tanah || 0,
          timestamp: new Date()
        };

        setSuhu(newData.suhu);
        setKelembapanUdara(newData.kelembapanUdara);
        setKelembapanTanah(newData.kelembapanTanah);
        setLastUpdate(new Date());

        setHistory(prev => {
          const newHistory = [...prev, newData];
          return newHistory.slice(-20);
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLive(false);
      });
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getChartData = (key) => {
    return history.map(h => h[key] || 0);
  };

  // Logika penentuan kondisi Kering, Basah, Lembap, dll.
  const getStatus = (value, type) => {
    if (type === 'suhu') {
      if (value < 20) return 'Dingin';
      if (value > 33) return 'Panas';
      return 'Normal';
    }
    if (type === 'kelembapanUdara') {
      if (value < 40) return 'Kering';
      if (value > 80) return 'Tinggi';
      return 'Normal';
    }
    if (type === 'kelembapanTanah') {
      if (value < 40) return 'Kering';
      if (value > 70) return 'Basah';
      return 'Lembap';
    }
    return 'Normal';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="space-y-6">
        {/* HEADER with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MdDashboard className="text-2xl" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Dashboard Monitoring
                </h1>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                  <FaClock className="text-xs" />
                  Real-time
                </span>
              </div>
              <p className="text-green-50/80 text-sm flex items-center gap-2">
                <FaMicrochip className="text-green-200" />
                Sistem monitoring nutrisi dan lingkungan tanaman
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-300 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm font-medium flex items-center gap-1">
                  <FaWifi className={`text-xs ${isLive ? 'text-green-300' : 'text-red-400'}`} />
                  {isLive ? 'LIVE' : 'Offline'}
                </span>
              </div>
              <button
                onClick={getData}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 text-sm font-medium backdrop-blur-sm flex items-center gap-2"
              >
                <MdRefresh className="text-base" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* SENSOR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SensorCard
            title="Suhu"
            icon={<FaThermometerHalf className="text-lg" />}
            iconBg="#ef4444"
            value={suhu !== null ? `${suhu.toFixed(1)}°C` : "0°C"}
            color={suhu >= 30 ? "#ef4444" : suhu <= 20 ? "#3b82f6" : "#22c55e"}
            subtitle="Celsius"
            status={getStatus(suhu, 'suhu')}
            trend={suhu ? { direction: suhu > 25 ? 'up' : 'down', value: Math.abs(suhu - 25).toFixed(1), label: 'dari normal' } : undefined}
          />

          <SensorCard
            title="Kelembapan Udara"
            icon={<FaTint className="text-lg" />}
            iconBg="#3b82f6"
            value={kelembapanUdara !== null ? `${kelembapanUdara.toFixed(0)}%` : "0%"}
            color="#3b82f6"
            subtitle="RH"
            status={getStatus(kelembapanUdara, 'kelembapanUdara')}
          />

          <SensorCard
            title="Kelembapan Tanah"
            icon={<FaSeedling className="text-lg" />}
            iconBg="#f59e0b"
            value={kelembapanTanah !== null ? `${kelembapanTanah.toFixed(0)}%` : "0%"}
            color="#f59e0b"
            subtitle="Moisture"
            status={getStatus(kelembapanTanah, 'kelembapanTanah')}
          />
        </div>

        {/* CHART SECTION */}
        {history.length > 0 && (
          <Card className="col-span-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BsGraphUp className="text-green-500 text-lg" />
                  <h3 className="text-sm font-semibold text-gray-700">Riwayat Sensor</h3>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <FaClock className="text-xs" />
                  Data 20 pembacaan terakhir
                </p>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FaCalendarAlt className="text-xs" />
                Last update: {lastUpdate.toLocaleTimeString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FaTemperatureLow className="text-red-400 text-xs" />
                    <span className="text-xs font-medium text-gray-500">Suhu</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {suhu !== null ? suhu.toFixed(1) : '0'}°C
                  </span>
                </div>
                <MiniChart data={getChartData('suhu')} color="#22c55e" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FaWater className="text-blue-400 text-xs" />
                    <span className="text-xs font-medium text-gray-500">Kelembapan Udara</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {kelembapanUdara !== null ? kelembapanUdara.toFixed(0) : '0'}%
                  </span>
                </div>
                <MiniChart data={getChartData('kelembapanUdara')} color="#3b82f6" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FaLeaf className="text-yellow-400 text-xs" />
                    <span className="text-xs font-medium text-gray-500">Kelembapan Tanah</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {kelembapanTanah !== null ? kelembapanTanah.toFixed(0) : '0'}%
                  </span>
                </div>
                <MiniChart data={getChartData('kelembapanTanah')} color="#f59e0b" />
              </div>
            </div>
          </Card>
        )}

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/gallery-physic')}
            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500 group-hover:bg-green-100 transition">
                <FaImages className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
                  Gallery Foto
                </p>
                <p className="text-xs text-gray-400">Lihat hasil analisis tanaman</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/laporan')}
            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition">
                <MdAnalytics className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
                  Analisis Data
                </p>
                <p className="text-xs text-gray-400">Lihat laporan lengkap</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/find-physic')}
            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 group-hover:bg-purple-100 transition">
                <FaCamera className="text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
                  Scan Tanaman
                </p>
                <p className="text-xs text-gray-400">Deteksi kondisi tanaman</p>
              </div>
            </div>
          </button>
        </div>

        {/* SYSTEM STATUS */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FaMicrochip className="text-xs" />
                  Sistem Status
                </p>
                <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  Berjalan Normal
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FaClock className="text-xs" />
                  Uptime
                </p>
                <p className="text-sm font-medium">2 jam 34 menit</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <FaDatabase className="text-xs" />
                  Pembacaan Terakhir
                </p>
                <p className="text-sm font-medium">
                  {lastUpdate.toLocaleTimeString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FaSignal className="text-xs" />
                Status Sensor
              </span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" title="Suhu Aktif" />
                <span className="w-2 h-2 rounded-full bg-green-500" title="Kelembapan Aktif" />
                <span className="w-2 h-2 rounded-full bg-green-500" title="Tanah Aktif" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;