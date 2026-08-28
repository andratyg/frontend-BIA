import { useEffect, useState } from "react";
import { FaImages, FaMicrochip, FaSearch, FaCheckCircle, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { MdAnalytics } from 'react-icons/md';

function GalleryPhisik() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/photos")
            .then(res => res.json())
            .then(data => {
                setPhotos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal ambil data:", err);
                setLoading(false);
            });
    }, []);

    const closeModal = () => setSelectedPhoto(null);

    // Filter photos based on search term
    const filteredPhotos = photos.filter(photo =>
        photo.analysis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(photo.created_at).toLocaleDateString("id-ID").includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                                <FaImages />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Gallery Hasil Foto Fisik
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaMicrochip className="text-green-500" />
                                    Kumpulan data foto dan hasil analisis AI tanaman
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200">
                            <FaSearch className="text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Cari analisis atau tanggal..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm w-48 md:w-64 text-gray-700 placeholder:text-gray-400"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistik Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                <FaImages className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Total Foto</p>
                                <p className="text-2xl font-bold text-gray-800">{photos.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                                <FaCheckCircle className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Dengan Analisis</p>
                                <p className="text-2xl font-bold text-green-600">{photos.filter(p => p.analysis).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
                                <FaCalendarAlt className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Terbaru</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {photos.length > 0 ? new Date(photos[0]?.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    }) : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Gallery */}
                {loading ? (
                    <div className="flex justify-center items-center py-20 flex-col gap-4">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Memuat data foto...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredPhotos.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedPhoto(item)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.full_url}
                                        alt="Tanaman"
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${item.analysis
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-500 text-white'
                                        }`}>
                                        {item.analysis ? "✓ Teranalisis" : "Pending"}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            Analisis Tanaman
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            #{String(item.id).padStart(3, '0')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                        <FaCalendarAlt className="text-xs" />
                                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </div>
                                    {item.analysis && (
                                        <div className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-lg mb-3 truncate">
                                            {item.analysis.substring(0, 60)}...
                                        </div>
                                    )}
                                    <button
                                        className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPhoto(item);
                                        }}
                                    >
                                        Lihat Detail
                                        <FaArrowRight className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredPhotos.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Belum Ada Foto
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {searchTerm ? "Tidak ada hasil yang cocok dengan pencarian Anda." : "Belum ada foto yang diunggah untuk dianalisis."}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
                            >
                                Reset Pencarian
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Premium */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                                    <MdAnalytics />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Detail Analisis AI
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        ID: #{String(selectedPhoto.id).padStart(3, '0')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Konten Modal */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="rounded-xl overflow-hidden bg-gray-100 mb-4">
                                <img
                                    src={selectedPhoto.full_url}
                                    alt="Detail Tanaman"
                                    className="w-full h-auto max-h-80 object-cover"
                                />
                            </div>

                            <div className="mb-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Hasil Analisis
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-700 leading-relaxed min-h-[80px] whitespace-pre-wrap">
                                    {selectedPhoto.analysis || (
                                        <span className="text-gray-400 italic">
                                            Belum ada hasil analisis untuk foto ini. Proses analisis sedang berlangsung atau belum dijalankan.
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                                <div className="flex items-center gap-2 text-sm text-green-700">
                                    <FaCalendarAlt className="text-xs" />
                                    Dianalisis pada: {new Date(selectedPhoto.created_at).toLocaleString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default GalleryPhisik;