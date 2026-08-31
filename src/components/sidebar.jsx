import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import Swal from 'sweetalert2';
import { useAuth } from "../context/AuthContext";
import {
    FaHome,
    FaCamera,
    FaChartBar,
    FaImages,
    FaComments,
    FaSignOutAlt,
    FaLeaf,
    FaCircle,
    FaMicrochip,
    FaWifi,
    FaSignal,
    FaUser,
    FaChevronLeft,
    FaChevronRight,
    FaSeedling,
    FaTree,
    FaWater,
    FaSun,
    FaCloudSun,
    FaThermometerHalf,
    FaTint,
    FaBolt,
    FaCog,
    FaBell,
    FaUserCircle,
    FaPlug
} from 'react-icons/fa';
import { MdDashboard, MdSensorDoor } from 'react-icons/md';
import { BiScan } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuLogOut } from 'react-icons/lu';


const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, getDeviceId } = useAuth();
    const [usn, setUsn] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const deviceId = getDeviceId();

    useEffect(() => {
        let mounted = true;

        apiClient.get("/usn", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('TOKEN')}`
            }
        })
            .then(res => {
                if (mounted) {
                    console.log("Data user yang login:", res.data);
                    setUsn(res.data);
                }
            })
            .catch(err => {
                console.error("Gagal mengambil nama user:", err);
            });

        return () => mounted = false;
    }, []);

    const getName = () => {
        if (!usn) return "Loading...";
        if (Array.isArray(usn)) return usn[0]?.name || "No Name";
        return usn.name || "No Name";
    };

    const getInitials = () => {
        const name = getName();
        if (name === "Loading..." || name === "No Name") return "U";
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Yakin mau keluar?',
            text: 'Sesi Anda di Verdatica akan diakhiri.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-3xl p-6',
                confirmButton: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md mx-2',
                cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl mx-2',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Berhasil Keluar!',
                    text: 'Sampai jumpa kembali.',
                    icon: 'success',
                    timer: 1500, 
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-3xl p-6',
                    }
                }).then(() => {
                    logout();
                    navigate('/login');
                });
            }
        });
    };

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <MdDashboard />,
            active: location.pathname === "/dashboard"
        },
        {
            name: "Monitoring Tanaman",
            path: "/plants",
            icon: <FaSeedling />,
            active: location.pathname === "/plants"
        },
        {
            name: "Koneksi Alat",
            path: "/device",
            icon: <FaPlug />,
            active: location.pathname === "/device",
            badge: !deviceId ? '!' : null, // badge notifikasi jika belum connect
        },
        {
            name: "Foto fisik",
            path: "/find-physic",
            icon: <BiScan />,
            active: location.pathname === "/find-physic"
        },
        {
            name: "Laporan",
            path: "/laporan",
            icon: <FaChartBar />,
            active: location.pathname === "/laporan"
        },
        {
            name: "Hasil Foto fisik",
            path: "/gallery-physic",
            icon: <FaImages />,
            active: location.pathname === "/gallery-physic"
        },
        {
            name: "Tanya AI",
            path: "/chat",
            icon: <FaComments />,
            active: location.pathname === "/chat"
        },
    ];

    const deviceStatus = [
        { name: "Sensor Suhu", status: "online", icon: <FaThermometerHalf /> },
        { name: "Sensor Kelembapan", status: "online", icon: <FaTint /> },
        { name: "Sensor Tanah", status: "online", icon: <FaSeedling /> },
        { name: "Sensor Cahaya", status: "offline", icon: <FaSun /> },
    ];


    return (
        <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-50 ${isCollapsed ? 'w-[72px]' : 'w-[230px]'
            }`}>
            <div className="flex flex-col h-full">
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                >
                    {isCollapsed ? (
                        <FaChevronRight className="text-xs text-gray-600" />
                    ) : (
                        <FaChevronLeft className="text-xs text-gray-600" />
                    )}
                </button>



                {/* User Profile */}
                {!isCollapsed && (
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {getInitials()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                    {getName()}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    <FaCircle className="inline w-1.5 h-1.5 text-green-500 mr-1" />
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${item.active
                                    ? "bg-green-50 text-green-600 border-l-4 border-green-500 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                } ${isCollapsed ? 'justify-center px-2 border-l-0' : ''}`}
                            title={isCollapsed ? item.name : ''}
                        >
                            <span className={`text-base ${item.active ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'} flex-shrink-0 relative`}>
                                {item.icon}
                                {/* Badge notifikasi (misal: device belum connect) */}
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                                        {item.badge}
                                    </span>
                                )}
                            </span>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 truncate">{item.name}</span>
                                    {item.badge && !item.active && (
                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                    {item.active && (
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                                    )}
                                </>
                            )}
                        </Link>
                    ))}

                    {/* Divider */}
                    <div className={`my-3 border-t border-gray-100 ${isCollapsed ? 'mx-2' : ''}`} />

                    {/* Settings & Logout */}
                    <Link
                        to="/threshold"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''
                            }`}
                        title={isCollapsed ? 'Threshold' : ''}
                    >
                        <FaCog className={`text-base ${isCollapsed ? '' : 'text-gray-400'}`} />
                        {!isCollapsed && <span>Pengaturan</span>}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''
                            }`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LuLogOut className="text-base" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </nav>


                {/* Device Status */}
                {!isCollapsed ? (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-3">
                            <MdSensorDoor className="text-gray-400 text-sm" />
                            <p className="text-xs font-medium text-gray-500">Device Status</p>
                            <span className="ml-auto text-[10px] text-gray-400">
                                {deviceStatus.filter(d => d.status === 'online').length} Online
                            </span>
                        </div>
                        <div className="space-y-2">
                            {deviceStatus.map((device, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`text-xs ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                                            {device.icon}
                                        </span>
                                        <span className="text-xs text-gray-600 truncate">{device.name}</span>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${device.status === 'online' ? 'bg-green-500' : 'bg-red-400'
                                        }`} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 border-t border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-1">
                                {deviceStatus.slice(0, 3).map((device, index) => (
                                    <span
                                        key={index}
                                        className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-400'
                                            }`}
                                        title={device.name}
                                    />
                                ))}
                            </div>
                            <p className="text-[8px] text-gray-400">Devices</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;