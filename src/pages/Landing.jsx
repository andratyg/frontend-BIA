import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Your Plants, <span className="text-brand-green">Our Passion</span>
        </h1>
        <p className="text-lg text-gray-600">
          Platform monitoring tanaman profesional dengan teknologi IoT dan AI untuk memastikan setiap tanaman Anda tumbuh optimal.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-6 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
        >
          Mulai Sekarang
        </button>
      </div>
    </section>
  );
}
