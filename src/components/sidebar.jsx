import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
    FaUserCircle
} from 'react-icons/fa';
import { MdDashboard, MdSensorDoor } from 'react-icons/md';
import { BiScan } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuLogOut } from 'react-icons/lu';

const Sidebar = () => {
    const location = useLocation();
    const [usn, setUsn] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        let mounted = true;

        fetch("http://localhost:8000/api/usn", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(res => res.json())
            .then(user => {
                if (mounted) {
                    console.log("Data user yang login:", user);
                    setUsn(user);
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

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <MdDashboard />,
            active: location.pathname === "/dashboard"
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
            name: "Chat",
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
                            <span className={`text-base ${item.active ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'} flex-shrink-0`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 truncate">{item.name}</span>
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
                        to="/settings"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''
                            }`}
                        title={isCollapsed ? 'Settings' : ''}
                    >
                        <FaCog className={`text-base ${isCollapsed ? '' : 'text-gray-400'}`} />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>

                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : ''
                            }`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LuLogOut className="text-base" />
                        {!isCollapsed && <span>Logout</span>}
                    </Link>
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