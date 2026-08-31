import '../../app.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import Swal from 'sweetalert2';

function Register() {
    const navigate = useNavigate();

    // State untuk menangkap input user
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState(''); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/register', {
                name: name,
                email: email,
                password: password,
                password_confirmation: passwordConfirmation
            });

            // Biasanya setelah register langsung dapat token (tergantung backend kamu)
            if (response.data.access_token) {
                localStorage.setItem('TOKEN', response.data.access_token);
                showSuccess('Pendaftaran Berhasil!', 'Akun Anda telah dibuat. Silakan login.', '/login');
            } else {
                showSuccess('Pendaftaran Berhasil!', 'Akun Anda telah dibuat. Silakan login.', '/');
            }

        } catch (err) {
            Swal.fire({
                title: 'Pendaftaran Gagal',
                text: err.response?.data?.message || 'Gagal mendaftar, cek kembali data kamu!',
                icon: 'error',
                confirmButtonText: 'Coba Lagi',
                customClass: {
                    popup: 'rounded-3xl p-6',
                    confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md',
                },
                buttonsStyling: false,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (title, text, redirectPath) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-3xl p-6' }
        }).then(() => {
            navigate(redirectPath);
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4" id='register'>
            {/* Dekorasi Blob */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20">

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl shadow-lg shadow-green-200 mb-4">
                            <span className="text-white font-black text-2xl">P</span>
                        </div>
                        <h2 className="text-3xl font-black text-stone-800 tracking-tight">Buat Akun</h2>
                        <p className="text-stone-500 font-medium mt-2">Mulai kelola laporan tanamanmu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div>
                            <label className="block text-sm font-bold text-stone-700 ml-1 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Masukkan nama kamu"
                                className="w-full px-5 py-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                            />
                        </div>

                        
                        <div>
                            <label className="block text-sm font-bold text-stone-700 ml-1 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                className="w-full px-5 py-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                            />
                        </div>

                        
                        <div>
                            <label className="block text-sm font-bold text-stone-700 ml-1 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-stone-100 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-stone-800 placeholder:text-stone-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-200 active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                        >
                            {loading ? 'Lagi diproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm font-medium text-stone-500">
                        Sudah punya akun?
                        <button onClick={() => navigate('/login')} className="text-green-600 font-bold hover:underline ml-1">Login Disini</button>
                    </p>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-stone-400 text-sm font-bold hover:text-stone-600 transition"
                    >
                        &larr; Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;