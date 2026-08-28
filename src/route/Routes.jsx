import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '../layouts/Navbar.jsx';
import Login from '../pages/auth/login.jsx';
import Home from '../pages/Home.jsx';
import Register from '../pages/auth/Register.jsx';
import Dashboard from '../pages/users/dashboard.jsx';
import FindPhisik from '../pages/users/findPhisik.jsx';
import Laporan from '../pages/users/laporan.jsx';
import GalleryPhisik from '../pages/users/GalerryPhisik.jsx';
import Chat from '../pages/users/chat.jsx';
import Sidebar from '../components/sidebar.jsx';

function AppContent() {
    const location = useLocation();

    // Konfigurasi route
    const routes = {
        // Halaman yang hanya menampilkan Navbar (tanpa Sidebar)
        navbarOnly: ['/', '/login', '/register'],

        // Halaman yang menampilkan Sidebar (tanpa Navbar)
        sidebarOnly: ['/dashboard', '/find-physic', '/laporan', '/gallery-physic', '/chat'],
    };

    const currentPath = location.pathname;
    const showNavbar = routes.navbarOnly.includes(currentPath);
    const showSidebar = routes.sidebarOnly.includes(currentPath);

    return (
        <>
            
            {showNavbar && <Navbar />}

            
            {showSidebar && <Sidebar />}

            
            <div className={showSidebar ? 'ml-[230px]' : ''}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/find-physic" element={<FindPhisik />} />
                    <Route path="/laporan" element={<Laporan />} />
                    <Route path="/gallery-physic" element={<GalleryPhisik />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </div>
        </>
    );
}

export default AppContent;