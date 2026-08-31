import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * Menghasilkan UUID v4 sederhana untuk session ID.
 */
function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Baca state dari localStorage saat pertama load
  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    const sessionId = localStorage.getItem('session_id');

    if (token && userId && sessionId) {
      setUser({ id: userId, name: userName, email: userEmail });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /**
   * Login — simpan semua data user + session ID baru.
   * Jika sudah ada session aktif di device lain, session lama akan di-overwrite
   * (user sebelumnya akan otomatis ter-logout saat tab lain melakukan request berikutnya).
   */
  const login = useCallback((token, userData) => {
    const sessionId = generateSessionId();

    localStorage.setItem('TOKEN', token);
    localStorage.setItem('user_id', String(userData.id));
    localStorage.setItem('user_name', userData.name || '');
    localStorage.setItem('user_email', userData.email || '');
    localStorage.setItem('session_id', sessionId);
    // Tandai sesi aktif di sessionStorage (hanya hidup selama tab ini terbuka)
    sessionStorage.setItem('active_session', sessionId);

    setUser({ id: String(userData.id), name: userData.name, email: userData.email });
    setIsAuthenticated(true);
  }, []);

  /**
   * Logout — hapus semua data auth dari storage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('session_id');
    sessionStorage.removeItem('active_session');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Cek apakah sesi saat ini masih valid.
   * Jika session_id di localStorage berbeda dengan yang di sessionStorage
   * (artinya ada login baru dari tab/device lain), paksa logout.
   */
  const checkSession = useCallback(() => {
    const storedSession = localStorage.getItem('session_id');
    const activeSession = sessionStorage.getItem('active_session');

    // Kalau tidak ada token → belum login
    if (!localStorage.getItem('TOKEN')) return false;

    // Kalau active_session tidak ada di sessionStorage tapi ada token
    // → tab baru dibuka setelah login sebelumnya, izinkan
    if (!activeSession && storedSession) {
      sessionStorage.setItem('active_session', storedSession);
      return true;
    }

    // Session ID berubah → ada login baru dari tempat lain → paksa logout
    if (activeSession && storedSession && activeSession !== storedSession) {
      logout();
      return false;
    }

    return !!storedSession;
  }, [logout]);

  const [deviceId, setDeviceIdState] = useState(() => {
    const userId = localStorage.getItem('user_id') || 'default';
    return localStorage.getItem(`device_id_${userId}`) || null;
  });

  /**
   * Ambil device_id yang tersimpan untuk user yang sedang login.
   */
  const getDeviceId = useCallback(() => {
    return deviceId;
  }, [deviceId]);

  /**
   * Simpan device_id untuk user yang sedang login.
   */
  const setDeviceId = useCallback((newDeviceId) => {
    const userId = localStorage.getItem('user_id') || 'default';
    localStorage.setItem(`device_id_${userId}`, String(newDeviceId));
    setDeviceIdState(String(newDeviceId));
  }, []);

  /**
   * Hapus device_id (disconnect device).
   */
  const removeDeviceId = useCallback(() => {
    const userId = localStorage.getItem('user_id') || 'default';
    localStorage.removeItem(`device_id_${userId}`);
    setDeviceIdState(null);
  }, []);

  /**
   * Ambil threshold suhu & kelembapan per-user dari localStorage.
   */
  const getThresholds = useCallback(() => {
    const userId = localStorage.getItem('user_id') || 'default';
    const raw = localStorage.getItem(`thresholds_${userId}`);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* ignore */ }
    }
    // Nilai default
    return {
      suhu: { dingin: 20, panas: 33 },
      kelembapanUdara: { kering: 40, tinggi: 80 },
      kelembapanTanah: { kering: 40, basah: 70 },
    };
  }, []);

  /**
   * Simpan threshold suhu & kelembapan per-user ke localStorage.
   */
  const saveThresholds = useCallback((thresholds) => {
    const userId = localStorage.getItem('user_id') || 'default';
    localStorage.setItem(`thresholds_${userId}`, JSON.stringify(thresholds));
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkSession,
    getDeviceId,
    setDeviceId,
    removeDeviceId,
    getThresholds,
    saveThresholds,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
