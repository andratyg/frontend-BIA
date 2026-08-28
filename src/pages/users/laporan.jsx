import React, { useState, useEffect } from "react";
import {
    FaMicrochip,
    FaClock,
    FaThermometerHalf,
    FaTint,
    FaSeedling,
    FaLeaf,
    FaCalendarAlt,
    FaChartLine,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
import { MdAnalytics, MdSensorDoor } from 'react-icons/md';
import { BiScan } from 'react-icons/bi';
import { BsGraphUp } from 'react-icons/bs';

function Laporan() {
    const [sensorData, setSensorData] = useState({
        suhu: 0,
        kelembapan_udara: 0,
        kelembapan_tanah: 0,
        status: "Menghubungkan...",
        history: [],
        trenSuhu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    });

    const getData = () => {
        fetch("http://localhost:8000/api/sensor/1")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                setSensorData((prevState) => {
                    const waktu = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
                    const logBaru = `Data diperbarui jam ${waktu} (Suhu: ${data.suhu}°C)`;
                    const trenBaru = [...prevState.trenSuhu.slice(1), Number(data.suhu)];

                    return {
                        ...prevState,
                        suhu: data.suhu,
                        kelembapan_udara: data.kelembapan_udara,
                        kelembapan_tanah: data.kelembapan_tanah,
                        status: "Normal",
                        history: [logBaru, ...prevState.history].slice(0, 5),
                        trenSuhu: trenBaru
                    };
                });
            })
            .catch((err) => {
                console.log(err);
                setSensorData(prevState => ({ ...prevState, status: "Error/Terputus" }));
            });
    };

    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                                <MdAnalytics />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Laporan Real-Time
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaMicrochip className="text-green-500" />
                                    Monitoring data otomatis dari sensor kebun
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${sensorData.status === 'Normal'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-red-50 text-red-600'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sensorData.status === 'Normal' ? 'bg-green-500' : 'bg-red-500'
                                    } animate-pulse`} />
                                {sensorData.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sensor Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {/* Card 1: Kelembapan Tanah */}
                    <SensorCard
                        title="Kel. Tanah"
                        value={sensorData.kelembapan_tanah}
                        unit="%"
                        icon={<FaSeedling className="text-lg" />}
                        color="#10B981"
                        percent={sensorData.kelembapan_tanah}
                        iconBg="#10B981"
                    />

                    {/* Card 2: Kelembapan Udara */}
                    <SensorCard
                        title="Kel. Udara"
                        value={sensorData.kelembapan_udara}
                        unit="%"
                        icon={<FaTint className="text-lg" />}
                        color="#3B82F6"
                        percent={sensorData.kelembapan_udara}
                        iconBg="#3B82F6"
                    />

                    {/* Card 3: Suhu */}
                    <SensorCard
                        title="Suhu"
                        value={sensorData.suhu}
                        unit="°C"
                        icon={<FaThermometerHalf className="text-lg" />}
                        color="#F59E0B"
                        percent={(sensorData.suhu / 50) * 100}
                        iconBg="#F59E0B"
                    />

                    {/* Card 4: Aktivitas */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <MdSensorDoor className="text-gray-400 text-sm" />
                            <h3 className="font-semibold text-gray-400 uppercase text-xs tracking-wider">
                                Aktivitas
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${sensorData.status === 'Normal' ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                <span className="text-xs font-medium uppercase tracking-tighter text-gray-600">
                                    Status: {sensorData.status}
                                </span>
                            </div>
                            <ul className="text-[10px] text-gray-500 space-y-1">
                                {sensorData.history.length === 0 ? (
                                    <li className="text-gray-400 italic">Belum ada histori data masuk...</li>
                                ) : (
                                    sensorData.history.map((item, index) => (
                                        <li key={index} className="flex items-center gap-1">
                                            <span className="text-green-500">•</span>
                                            {item}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Visualisasi Tren */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BsGraphUp className="text-green-500 text-lg" />
                            <h3 className="font-bold text-gray-800 text-lg">Visualisasi Tren Suhu</h3>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FaClock className="text-xs" />
                            Update real-time
                        </span>
                    </div>
                    <div className="h-32 flex items-end gap-1.5">
                        {sensorData.trenSuhu.map((nilaiSuhu, i) => {
                            const tinggiPersen = (nilaiSuhu / 50) * 100;
                            const isActive = i === sensorData.trenSuhu.length - 1;

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-t-lg transition-all duration-500 relative group ${isActive ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 'bg-green-200 hover:bg-green-300'
                                        }`}
                                    style={{ height: `${Math.max(tinggiPersen, 2)}%` }}
                                >
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        {nilaiSuhu}°C
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                        <span>1</span>
                        <span>6</span>
                        <span>12</span>
                    </div>
                </div>

                {/* Status Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                            <FaCheckCircle className="text-lg" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Status Sistem</p>
                            <p className="text-sm font-semibold text-green-600">Berjalan Normal</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                            <FaClock className="text-lg" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Update Terakhir</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
                            <FaLeaf className="text-lg" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Data</p>
                            <p className="text-sm font-semibold text-gray-800">{sensorData.history.length} Record</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen Sensor Card yang ditingkatkan
function SensorCard({ title, value, unit, icon, color, percent, iconBg }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shadow-sm"
                    style={{ backgroundColor: iconBg || color }}
                >
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-1">
                        {title}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 leading-none">
                        {value}<span className="text-sm ml-0.5 text-gray-500">{unit}</span>
                    </h2>
                </div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-700 ease-out rounded-full"
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </div>
    );
}

export default Laporan;