import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus, FaEdit, FaTrash, FaLeaf, FaSeedling, FaSearch,
  FaThermometerHalf, FaTint, FaFilter, FaSpinner, FaExclamationTriangle,
  FaCheckCircle, FaTimes, FaChartLine, FaRobot
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiBot } from "react-icons/bi";
import { getPlants, createPlant, updatePlant, deletePlant, plantProfiles } from "../../services/plantService";
import { getSensorData } from "../../services/monitoringService";
import { sendPlantAnalysis } from "../../services/aiService";

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
const PLANT_TYPES = Object.entries(plantProfiles).map(([key, val]) => ({ key, ...val }));

const emptyForm = { name: "", type: "general", location: "", plantingDate: "", notes: "" };

// ─────────────────────────────────────────────
// Form Validation
// ─────────────────────────────────────────────
const validateForm = (data) => {
  const errors = {};
  if (!data.name.trim()) errors.name = "Nama tanaman wajib diisi";
  if (!data.type) errors.type = "Jenis tanaman wajib dipilih";
  if (!data.location.trim()) errors.location = "Lokasi wajib diisi";
  return errors;
};

// ─────────────────────────────────────────────
// Markdown ringan → JSX (dipakai untuk render hasil analisis AI)
// Mendukung: ## Heading, - bullet / * bullet, **bold**, paragraf
// ─────────────────────────────────────────────
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
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
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
        <h4 key={`h-${idx}`} className="text-sm font-bold text-emerald-700 mt-4 mb-1.5 first:mt-0">
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

// ─────────────────────────────────────────────
// Plant Type Badge
// ─────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const profile = plantProfiles[type] || plantProfiles.general;
  const colorMap = {
    general: "bg-blue-50 text-blue-600",
    cabe: "bg-red-50 text-red-600",
    padi: "bg-yellow-50 text-yellow-700"
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorMap[type] || colorMap.general}`}>
      {profile.icon} {profile.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// Sensor Mini Display
// ─────────────────────────────────────────────
const SensorMini = ({ sensorData, loading }) => {
  if (loading) return <p className="text-xs text-gray-400 animate-pulse">Memuat sensor...</p>;
  if (!sensorData) return <p className="text-xs text-gray-400 italic">Sensor tidak tersedia</p>;
  return (
    <div className="flex gap-3 text-xs text-gray-600 flex-wrap">
      <span className="flex items-center gap-1"><FaThermometerHalf className="text-red-400" />{sensorData.suhu ?? "-"}°C</span>
      <span className="flex items-center gap-1"><FaTint className="text-blue-400" />{sensorData.kelembapan_udara ?? "-"}% Udara</span>
      <span className="flex items-center gap-1"><FaSeedling className="text-green-500" />{sensorData.kelembapan_tanah ?? "-"}% Tanah</span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Modal Form (Create/Edit)
// ─────────────────────────────────────────────
const PlantFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ general: "Gagal menyimpan data tanaman. Coba lagi." });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
              <FaLeaf className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">{isEdit ? "Edit Tanaman" : "Tambah Tanaman"}</h2>
              <p className="text-green-100 text-xs">{isEdit ? "Perbarui data tanaman" : "Tambahkan tanaman baru"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition"><FaTimes /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-center gap-2">
              <FaExclamationTriangle /> {errors.general}
            </div>
          )}

          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Tanaman <span className="text-red-500">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Cabe A, Padi B"
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Jenis */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis Tanaman <span className="text-red-500">*</span></label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.type ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all`}
            >
              {PLANT_TYPES.map(({ key, label, icon }) => (
                <option key={key} value={key}>{icon} {label}</option>
              ))}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi <span className="text-red-500">*</span></label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Contoh: Greenhouse 1, Kebun Belakang"
              className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Tanggal Tanam */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Tanam</label>
            <input
              type="date"
              name="plantingDate"
              value={form.plantingDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all"
            />
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Catatan tambahan tentang tanaman..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? <><FaSpinner className="animate-spin" /> Menyimpan...</> : <><FaCheckCircle /> {isEdit ? "Simpan Perubahan" : "Tambah Tanaman"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Delete Confirmation Modal
// ─────────────────────────────────────────────
const DeleteModal = ({ isOpen, plant, onConfirm, onClose }) => {
  const [deleting, setDeleting] = useState(false);
  if (!isOpen || !plant) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); } finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50">
          <FaTrash className="text-red-500 text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Tanaman?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Apakah kamu yakin ingin menghapus <strong className="text-gray-700">{plant.name}</strong>? Aksi ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? <><FaSpinner className="animate-spin" /> Menghapus...</> : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// AI Analysis Panel
// ─────────────────────────────────────────────
// Pesan error dari provider AI (Gemini dkk) dilempar sebagai Error asli oleh
// aiService.js (lihat assertValidAiResponse), lengkap dengan properti
// isQuotaError / retrySeconds / rawMessage — tinggal dibaca dari sini.
const AIAnalysisPanel = ({ plant, sensorData, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [showRawError, setShowRawError] = useState(false);

// Run analysis only when the selected plant changes
const runAnalysis = async () => {
  if (!plant) return;
  setLoading(true);
  setError(null);
  setErrorDetail(null);
  setAnalysis(null);
  try {
    const result = await sendPlantAnalysis({ plant, monitoring: sensorData });
    setAnalysis(result.reply || result.message || JSON.stringify(result));
  } catch (err) {
    if (err.isAiProviderError) {
      setError(err.message);
      setErrorDetail({ retrySeconds: err.retrySeconds, raw: err.rawMessage });
    } else {
      setError("Gagal menghubungi AI. Periksa koneksi server.");
    }
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  runAnalysis();
}, [plant]);

  const profile = plantProfiles[plant?.type] || plantProfiles.general;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-green-600 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
              <BiBot className="text-xl" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate">Analisis AI — {plant?.name}</h2>
              <p className="text-emerald-100 text-sm truncate">{profile.icon} {profile.label} · {plant?.location}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition shrink-0"><FaTimes /></button>
        </div>

        {/* Context */}
        {sensorData && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600 shrink-0">
            <span><FaThermometerHalf className="inline text-red-400 mr-1" />{sensorData.suhu ?? "-"}°C</span>
            <span><FaTint className="inline text-blue-400 mr-1" />{sensorData.kelembapan_udara ?? "-"}% Udara</span>
            <span><FaSeedling className="inline text-green-500 mr-1" />{sensorData.kelembapan_tanah ?? "-"}% Tanah</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <FaSpinner className="text-4xl text-emerald-500 animate-spin" />
              <p className="text-gray-500 text-sm">AI sedang menganalisis tanaman {plant?.name}...</p>
            </div>
          )}
          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl flex items-start gap-3">
              <FaExclamationTriangle className="mt-0.5 flex-shrink-0 text-amber-500" />
              <div className="min-w-0">
                <p className="font-semibold">{error}</p>
                {errorDetail?.retrySeconds && (
                  <p className="text-xs text-amber-700 mt-1">Coba lagi dalam ±{errorDetail.retrySeconds} detik, atau naikkan plan/billing Gemini kamu.</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={runAnalysis} className="text-amber-700 font-semibold hover:underline text-xs">Coba Lagi</button>
                  {errorDetail?.raw && (
                    <button onClick={() => setShowRawError((v) => !v)} className="text-amber-600 hover:underline text-xs">
                      {showRawError ? "Sembunyikan detail teknis" : "Lihat detail teknis"}
                    </button>
                  )}
                </div>
                {showRawError && errorDetail?.raw && (
                  <pre className="mt-2 text-[11px] leading-relaxed text-amber-700 bg-amber-100/60 rounded-lg p-3 whitespace-pre-wrap break-words">
                    {errorDetail.raw}
                  </pre>
                )}
              </div>
            </div>
          )}
          {analysis && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hasil Analisis</h4>
              </div>
              <FormattedAnalysis text={analysis} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button onClick={runAnalysis} disabled={loading} className="px-5 py-2 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-all disabled:opacity-50">
            Analisis Ulang
          </button>
          <button onClick={onClose} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Plant Card
// ─────────────────────────────────────────────
const PlantCard = ({ plant, sensorData, sensorLoading, onEdit, onDelete, onAnalyze }) => {
  const profile = plantProfiles[plant.type] || plantProfiles.general;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      {/* Top color bar by plant type */}
      <div className={`h-1.5 w-full ${plant.type === 'cabe' ? 'bg-gradient-to-r from-red-400 to-orange-400' : plant.type === 'padi' ? 'bg-gradient-to-r from-yellow-400 to-amber-400' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${plant.type === 'cabe' ? 'bg-red-50' : plant.type === 'padi' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
              {profile.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 text-base truncate">{plant.name}</h3>
              <p className="text-xs text-gray-400 truncate">{plant.location}</p>
            </div>
          </div>
          <TypeBadge type={plant.type} />
        </div>

        {/* Planting date */}
        {plant.plantingDate && (
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            🗓 Ditanam: {new Date(plant.plantingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}

        {/* Sensor data */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">📡 Data Sensor</p>
          <SensorMini sensorData={sensorData} loading={sensorLoading} />
        </div>

        {/* Notes */}
        {plant.notes && (
          <p className="text-xs text-gray-500 italic truncate mb-4">📝 {plant.notes}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAnalyze(plant)}
            className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-xs font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <FaRobot /> Analisis AI
          </button>
          <button
            onClick={() => onEdit(plant)}
            className="p-2 border border-blue-100 text-blue-500 rounded-xl hover:bg-blue-50 transition-all text-sm"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(plant)}
            className="p-2 border border-red-100 text-red-400 rounded-xl hover:bg-red-50 transition-all text-sm"
            title="Hapus"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
function PlantMonitoring() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [sensorLoading, setSensorLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Modals
  const [formModal, setFormModal] = useState({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, plant: null });
  const [aiModal, setAiModal] = useState({ open: false, plant: null });

  // Filter
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load plants
  const loadPlants = useCallback(async () => {
    setPageLoading(true);
    setPageError(null);
    try {
      const data = await getPlants();
      setPlants(Array.isArray(data) ? data : []);
    } catch (err) {
      setPageError("Gagal mengambil data tanaman. Periksa koneksi server.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  // Load sensor (ID=1, existing endpoint)
  const loadSensor = useCallback(async () => {
    setSensorLoading(true);
    try {
      const data = await getSensorData(1);
      setSensorData(data);
    } catch {
      setSensorData(null);
    } finally {
      setSensorLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlants();
    loadSensor();
    const interval = setInterval(loadSensor, 5000);
    return () => clearInterval(interval);
  }, [loadPlants, loadSensor]);

  // CRUD handlers
  const handleCreate = async (formData) => {
    const newPlant = await createPlant(formData);
    setPlants((prev) => [...prev, newPlant]);
  };

  const handleUpdate = async (formData) => {
    const updated = await updatePlant(formModal.data.id, formData);
    setPlants((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = async () => {
    await deletePlant(deleteModal.plant.id);
    setPlants((prev) => prev.filter((p) => p.id !== deleteModal.plant.id));
    setDeleteModal({ open: false, plant: null });
  };

  // Filtered plants
  const filteredPlants = plants.filter((p) => {
    const matchType = filterType === "all" || p.type === filterType;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const filterCounts = PLANT_TYPES.reduce((acc, { key }) => {
    acc[key] = plants.filter((p) => p.type === key).length;
    return acc;
  }, { all: plants.length });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="space-y-6">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20">
          {/* Decorative blobs — modern SaaS touch */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          <div className="relative flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaLeaf className="text-xl" />
                </div>
                <h1 className="text-2xl font-bold">Monitoring Tanaman</h1>
              </div>
              <p className="text-green-100 text-sm">Kelola dan pantau semua tanaman Anda secara real-time</p>
            </div>
            <button
              onClick={() => setFormModal({ open: true, data: null })}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <FaPlus /> Tambah Tanaman
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all flex-1 min-w-[200px]">
              <FaSearch className="text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Cari tanaman atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder:text-gray-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilter className="text-gray-400 text-sm" />
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterType === "all" ? "bg-green-500 text-white shadow-sm shadow-green-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Semua ({filterCounts.all})
              </button>
              {PLANT_TYPES.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterType === key ? "bg-green-500 text-white shadow-sm shadow-green-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {icon} {label} ({filterCounts[key] || 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {pageError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl flex items-center gap-3">
            <FaExclamationTriangle />
            <div>
              <p>{pageError}</p>
              <button onClick={loadPlants} className="text-red-600 font-semibold hover:underline text-xs mt-1">Coba Lagi</button>
            </div>
          </div>
        )}

        {/* Loading */}
        {pageLoading ? (
          <div className="flex justify-center items-center py-20 flex-col gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Memuat data tanaman...</p>
          </div>
        ) : (
          <>
            {/* Plant Grid */}
            {filteredPlants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    sensorData={sensorData}
                    sensorLoading={sensorLoading}
                    onEdit={(p) => setFormModal({ open: true, data: p })}
                    onDelete={(p) => setDeleteModal({ open: true, plant: p })}
                    onAnalyze={(p) => setAiModal({ open: true, plant: p })}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {searchTerm || filterType !== "all" ? "Tidak ada tanaman yang cocok" : "Belum ada tanaman"}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {searchTerm || filterType !== "all"
                    ? "Coba ubah filter atau kata kunci pencarian."
                    : "Mulai tambahkan tanaman pertama Anda."}
                </p>
                {!(searchTerm || filterType !== "all") && (
                  <button
                    onClick={() => setFormModal({ open: true, data: null })}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                  >
                    <FaPlus /> Tambah Tanaman Pertama
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <PlantFormModal
        isOpen={formModal.open}
        initialData={formModal.data}
        onClose={() => setFormModal({ open: false, data: null })}
        onSave={formModal.data ? handleUpdate : handleCreate}
      />

      <DeleteModal
        isOpen={deleteModal.open}
        plant={deleteModal.plant}
        onClose={() => setDeleteModal({ open: false, plant: null })}
        onConfirm={handleDelete}
      />

      {aiModal.open && aiModal.plant && (
        <AIAnalysisPanel
          plant={aiModal.plant}
          sensorData={sensorData}
          onClose={() => setAiModal({ open: false, plant: null })}
        />
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

export default PlantMonitoring;
