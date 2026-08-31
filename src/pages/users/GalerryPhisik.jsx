import { useEffect, useState } from "react";
import { FaImages, FaMicrochip, FaSearch, FaCheckCircle, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import apiClient from "../../services/apiClient";
import { MdAnalytics } from 'react-icons/md';
import Swal from 'sweetalert2';


function stripMarkdown(text = "") {
    return text
        .replace(/^#{1,6}\s+/gm, "")   // buang heading markdown
        .replace(/\*\*(.*?)\*\*/g, "$1") // buang bold
        .replace(/\*(.*?)\*/g, "$1")     // buang italic
        .replace(/^[-*]\s+/gm, "")       // buang bullet marker
        .replace(/\n+/g, " ")
        .trim();
}

function renderInline(text, keyPrefix) {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={`${keyPrefix}-${i}`} className="font-semibold text-gray-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return <span key={`${keyPrefix}-${i}`}>{part}</span>;
    });
}


function FormattedAnalysis({ text }) {
    if (!text) return null;

    const lines = text.split("\n");
    const blocks = [];
    let currentList = [];

    const flushList = (key) => {
        if (currentList.length > 0) {
            blocks.push(
                <ul key={`list-${key}`} className="list-none space-y-1.5 my-2">
                    {currentList.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                            <span>{renderInline(item, `li-${key}-${i}`)}</span>
                        </li>
                    ))}
                </ul>
            );
            currentList = [];
        }
    };

    lines.forEach((rawLine, idx) => {
        const line = rawLine.trim();

        if (line === "") {
            flushList(idx);
            return;
        }

        const headingMatch = line.match(/^#{1,6}\s+(.*)/);
        if (headingMatch) {
            flushList(idx);
            blocks.push(
                <h4
                    key={`h-${idx}`}
                    className="text-sm font-bold text-green-700 mt-4 mb-1.5 first:mt-0"
                >
                    {renderInline(headingMatch[1], `h-${idx}`)}
                </h4>
            );
            return;
        }

        const bulletMatch = line.match(/^[-*]\s+(.*)/);
        if (bulletMatch) {
            currentList.push(bulletMatch[1]);
            return;
        }

        flushList(idx);
        blocks.push(
            <p key={`p-${idx}`} className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">
                {renderInline(line, `p-${idx}`)}
            </p>
        );
    });
    flushList("end");

    return <div>{blocks}</div>;
}

function GalleryPhisik() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const userId = localStorage.getItem('user_id'); // Ambil user ID saat ini

    useEffect(() => {
        // Coba kirim user_id sebagai query parameter (jika backend mendukung)
        apiClient.get("/photos", { params: { user_id: userId } })
            .then(res => {
                let data = res.data;
                
                // Fallback: Jika backend mengembalikan semua foto dan mengabaikan query param,
                // kita filter manual di frontend (asalkan data foto memiliki field user_id)
                if (userId && data.length > 0 && data[0].user_id !== undefined) {
                    data = data.filter(photo => String(photo.user_id) === String(userId));
                }
                
                setPhotos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal ambil data:", err);
                setLoading(false);
            });
    }, [userId]);

    const closeModal = () => setSelectedPhoto(null);

    // Tambahkan fungsi hapus foto
    const handleDelete = async (e, photoId) => {
      e.stopPropagation(); 
      
      Swal.fire({
          title: 'Hapus Foto?',
          text: 'Data foto yang dihapus tidak dapat dikembalikan.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, Hapus',
          cancelButtonText: 'Batal',
          reverseButtons: true,
          customClass: {
              popup: 'rounded-3xl p-6',
              confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl mx-2 shadow-md',
              cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2.5 rounded-xl mx-2',
          },
          buttonsStyling: false,
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  await apiClient.delete(`/photos/${photoId}`);
                  setPhotos((prev) => prev.filter((p) => p.id !== photoId));
                  Swal.fire({
                      title: 'Dihapus!',
                      text: 'Foto berhasil dihapus dari galeri.',
                      icon: 'success',
                      timer: 1500,
                      showConfirmButton: false,
                      customClass: { popup: 'rounded-3xl p-6' }
                  });
              } catch (err) {
                  console.error('Gagal menghapus foto:', err);
                  Swal.fire({
                      title: 'Gagal!',
                      text: 'Terjadi kesalahan saat menghapus foto.',
                      icon: 'error',
                      showConfirmButton: false,
                      timer: 2000,
                      customClass: { popup: 'rounded-3xl p-6' }
                  });
              }
          }
      });
    };

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
                        {filteredPhotos.map((item) => {
                            const cleanPreview = stripMarkdown(item.analysis || "");
                            return (
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
                                                {cleanPreview.substring(0, 60)}
                                                {cleanPreview.length > 60 ? "..." : ""}
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
                                        <button
                                            className="mt-2 w-full py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                                            onClick={(e) => handleDelete(e, item.id)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-lg shadow-md shrink-0">
                                    <MdAnalytics />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-800 leading-tight">
                                        Detail Analisis AI
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        ID: #{String(selectedPhoto.id).padStart(3, '0')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Konten Modal */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="bg-gray-100">
                                <img
                                    src={selectedPhoto.full_url}
                                    alt="Detail Tanaman"
                                    className="w-full h-64 object-cover"
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-1.5 h-4 rounded-full bg-green-500" />
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Hasil Analisis
                                    </h4>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 min-h-[80px]">
                                    {selectedPhoto.analysis ? (
                                        <FormattedAnalysis text={selectedPhoto.analysis} />
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">
                                            Belum ada hasil analisis untuk foto ini. Proses analisis sedang berlangsung atau belum dijalankan.
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                                    <FaCalendarAlt className="text-green-500" />
                                    Dianalisis pada{" "}
                                    {new Date(selectedPhoto.created_at).toLocaleString("id-ID", {
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
                        <div className="flex justify-end px-6 py-3 border-t border-gray-100 bg-white shrink-0">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
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
