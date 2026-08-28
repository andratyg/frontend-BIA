import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaVideo,
    FaStop,
    FaUpload,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRedo,
    FaLightbulb,
    FaMicrochip,
    FaRuler,
    FaCamera,
    FaImage
} from 'react-icons/fa';
import { MdPhotoCamera } from 'react-icons/md';
import { BiScan } from 'react-icons/bi';

function FindPhisik() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingStream, setPendingStream] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    useEffect(() => {
        if (isCameraOn && videoRef.current && pendingStream) {
            videoRef.current.srcObject = pendingStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(e => console.error("Gagal autoplay video:", e));
            };
            setPendingStream(null);
        }
    }, [isCameraOn, pendingStream]);

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        setPhoto(null);
        setError(null);
        setAnalysisResult(null);
        setIsLoading(true);

        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });
            } catch (err) {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
            }

            streamRef.current = stream;
            setPendingStream(stream);
            setIsCameraOn(true);
            setIsLoading(false);

        } catch (err) {
            console.error("Error kamera:", err);
            setIsLoading(false);

            if (err.name === "NotAllowedError") {
                setError("Akses kamera ditolak. Izinkan izin kamera di browser Anda.");
            } else if (err.name === "NotFoundError") {
                setError("Kamera tidak ditemukan pada perangkat ini.");
            } else if (err.name === "NotReadableError") {
                setError("Kamera sedang dipakai aplikasi lain.");
            } else {
                setError("Gagal mengakses kamera. Coba refresh halaman.");
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setPendingStream(null);
        setIsCameraOn(false);
        setIsLoading(false);
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !video.srcObject || video.paused || video.ended) {
            setError("Video kamera belum siap. Mohon tunggu sebentar.");
            return;
        }

        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);

        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData);
        setAnalysisResult(null);

        stopCamera();
    };

    const sendPhoto = async () => {
        if (!photo) return;

        setIsUploading(true);
        setError(null);

        try {
            const res = await fetch(photo);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append("image", blob, "photo.png");

            const response = await fetch(
                "http://localhost:8000/api/analyze-image",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal menganalisis gambar");
            }

            setAnalysisResult(data.analysis);
            setPhoto(null);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        setAnalysisResult(null);
        setError(null);
        startCamera();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                                <BiScan />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Find Phisik
                                </h1>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FaMicrochip className="text-green-500" />
                                    Deteksi kondisi tanaman dengan AI
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 ${isCameraOn ? 'bg-green-500' : 'bg-gray-400'} rounded-full animate-pulse`} />
                                {isCameraOn ? 'Kamera Aktif' : 'Siap'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slideDown">
                        <FaExclamationTriangle className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-red-700">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium mt-1"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Camera Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-6">
                        <div className="relative max-w-2xl mx-auto">
                            {/* Camera Preview */}
                            <div className="relative bg-black rounded-xl overflow-hidden aspect-[3/4] md:aspect-[4/3]">
                                {isLoading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
                                        <FaSpinner className="text-4xl animate-spin mb-3 text-green-400" />
                                        <p className="text-sm text-gray-300">Mengakses kamera...</p>
                                    </div>
                                ) : isCameraOn ? (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                ) : photo ? (
                                    <img
                                        src={photo}
                                        alt="Hasil Tangkapan"
                                        className="w-full h-full object-cover"
                                    />
                                ) : analysisResult ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white bg-gradient-to-br from-green-900/95 to-emerald-900/95">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                            <FaCheckCircle className="text-5xl text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Analisis Selesai!</h3>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md text-center">
                                            <p className="text-sm text-gray-200 leading-relaxed">{analysisResult}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAnalysisResult(null);
                                                startCamera();
                                            }}
                                            className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                        >
                                            <FaCamera className="text-sm" />
                                            Analisis Baru
                                        </button>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
                                        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 border-2 border-gray-700">
                                            <FaCamera className="text-4xl text-gray-400" />
                                        </div>
                                        <p className="text-gray-300 text-sm">Kamera belum aktif</p>
                                        <p className="text-gray-500 text-xs mt-1">Tekan tombol di bawah untuk memulai</p>
                                    </div>
                                )}

                                {/* Camera Status Overlay */}
                                {isCameraOn && (
                                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-white text-xs font-medium">REC</span>
                                    </div>
                                )}

                                {/* Photo Indicator */}
                                {photo && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                                        <FaImage className="text-white text-xs" />
                                        <span className="text-white text-xs">1 foto</span>
                                    </div>
                                )}

                                {/* Grid Overlay for Composition */}
                                {isCameraOn && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="border border-white/10" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hidden Canvas */}
                            <canvas ref={canvasRef} style={{ display: "none" }} />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50/50">
                        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
                            {!isCameraOn && !photo && !analysisResult && (
                                <button
                                    onClick={startCamera}
                                    disabled={isLoading}
                                    className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <FaVideo className="text-lg" />
                                    {isLoading ? 'Memuat...' : 'Nyalakan Kamera'}
                                </button>
                            )}

                            {isCameraOn && (
                                <>
                                    <button
                                        onClick={takePhoto}
                                        className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <MdPhotoCamera className="text-lg" />
                                        Ambil Foto
                                    </button>
                                    <button
                                        onClick={stopCamera}
                                        className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaStop className="text-lg" />
                                        Batal
                                    </button>
                                </>
                            )}

                            {photo && !isCameraOn && (
                                <>
                                    <button
                                        onClick={sendPhoto}
                                        disabled={isUploading}
                                        className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <FaSpinner className="text-lg animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload className="text-lg" />
                                                Kirim & Analisis
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={retakePhoto}
                                        className="flex-1 min-w-[140px] px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaRedo className="text-lg" />
                                        Ambil Ulang
                                    </button>
                                </>
                            )}

                            {analysisResult && (
                                <button
                                    onClick={() => {
                                        setAnalysisResult(null);
                                        startCamera();
                                    }}
                                    className="flex-1 min-w-[140px] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FaCamera className="text-lg" />
                                    Analisis Baru
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                <FaLightbulb className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Tips #1</p>
                                <p className="text-sm font-medium text-gray-700">Cahaya Cukup</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Pastikan ruangan memiliki pencahayaan yang cukup untuk hasil foto yang jelas.</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                                <FaRuler className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Tips #2</p>
                                <p className="text-sm font-medium text-gray-700">Jarak Optimal</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Ambil foto dari jarak 20-30 cm untuk hasil analisis yang akurat.</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
                                <FaMicrochip className="text-lg" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Tips #3</p>
                                <p className="text-sm font-medium text-gray-700">Objek Fokus</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Pastikan tanaman yang difoto berada dalam fokus dan tidak bergerak.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default FindPhisik;