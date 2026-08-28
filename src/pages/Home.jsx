import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    { value: "10,000+", label: "Pengguna Aktif", emoji: "👥", color: "#FF6B6B" },
    { value: "50,000+", label: "Tanaman Terpantau", emoji: "🌱", color: "#10B981" },
    { value: "4.9", label: "Rating Pengguna", emoji: "⭐", color: "#F59E0B" },
    { value: "99%", label: "Kepuasan", emoji: "💚", color: "#8B5CF6" }
  ];

  const services = [
    {
      emoji: "📊",
      title: "Real-time Monitoring",
      desc: "Pantau kondisi tanaman Anda 24/7 dengan update data setiap detik menggunakan sensor IoT terkini.",
      color: "#10B981",
      bgLight: "rgba(16,185,129,0.08)"
    },
    {
      emoji: "🔔",
      title: "Smart Notification",
      desc: "Dapatkan notifikasi otomatis via email & WhatsApp saat tanaman membutuhkan perhatian khusus.",
      color: "#3B82F6",
      bgLight: "rgba(59,130,246,0.08)"
    },
    {
      emoji: "📈",
      title: "Growth Analytics",
      desc: "Analisis pertumbuhan tanaman dengan laporan detail dan grafik perkembangan harian.",
      color: "#8B5CF6",
      bgLight: "rgba(139,92,246,0.08)"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Wijaya",
      role: "CEO & Founder",
      emoji: "👩‍🔬",
      desc: "PhD in Botany, 15+ years experience",
      color: "#FF6B6B"
    },
    {
      name: "Alex Pratama",
      role: "CTO",
      emoji: "👨‍💻",
      desc: "IoT Specialist, Ex-Google Engineer",
      color: "#3B82F6"
    },
    {
      name: "Maya Indah",
      role: "Head of Design",
      emoji: "🎨",
      desc: "Award-winning UI/UX Designer",
      color: "#8B5CF6"
    },
    {
      name: "Rio Hartono",
      role: "Plant Expert",
      emoji: "🌿",
      desc: "Certified Horticulturist",
      color: "#10B981"
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Plant Enthusiast",
      text: "PlantLog mengubah cara saya merawat tanaman. Sekarang koleksi 50+ tanaman saya selalu sehat!",
      emoji: "😊",
      rating: 5
    },
    {
      name: "Anisa Putri",
      role: "Urban Farmer",
      text: "Fitur monitoring real-time sangat membantu bisnis urban farming saya. Highly recommended!",
      emoji: "🌟",
      rating: 5
    },
    {
      name: "Dian Pratama",
      role: "Botanical Garden Manager",
      text: "PlantLog membantu kami memonitor ribuan tanaman dengan mudah. Interface yang intuitif!",
      emoji: "🏆",
      rating: 5
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFBEB 0%, #F0FDF4 25%, #EFF6FF 50%, #FEF2F2 75%, #FAF5FF 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1F2937',
      overflowX: 'hidden'
    }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite 1s; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
        }
        
        .glass-effect {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .gradient-text-green {
          background: linear-gradient(135deg, #10B981, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-colorful {
          background: linear-gradient(135deg, #FF6B6B, #F59E0B, #10B981, #3B82F6, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Background Decorations */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'rgba(16,185,129,0.1)', filter: 'blur(80px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute', top: '40%', right: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(59,130,246,0.1)', filter: 'blur(80px)',
          animation: 'pulse 5s ease-in-out infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '20%', left: '30%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'rgba(139,92,246,0.08)', filter: 'blur(80px)',
          animation: 'pulse 6s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute', top: '60%', right: '30%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,107,107,0.08)', filter: 'blur(80px)',
          animation: 'pulse 4.5s ease-in-out infinite 1.5s'
        }}></div>
      </div>

      {/* ========== HERO SECTION ========== */}
      <section id="home" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        paddingTop: '120px',
        paddingBottom: '80px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center'
          }}>

            {/* Left Column */}
            <div className="animate-fadeInUp">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 24px',
                background: 'rgba(16,185,129,0.1)',
                borderRadius: '50px',
                marginBottom: '28px',
                border: '1px solid rgba(16,185,129,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ fontSize: '20px' }}>🏆</span>
                <span style={{
                  color: '#059669',
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '0.5px'
                }}>
                  #1 PLANT MONITORING PLATFORM IN INDONESIA
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(42px, 5vw, 68px)',
                fontWeight: 900,
                lineHeight: 1.08,
                marginBottom: '24px',
                letterSpacing: '-1.5px'
              }}>
                <span style={{ color: '#1F2937' }}>Your Plants,</span><br />
                <span className="gradient-text-green">Our Passion</span>
              </h1>

              <p style={{
                fontSize: '19px',
                color: '#6B7280',
                lineHeight: 1.7,
                marginBottom: '36px',
                maxWidth: '520px'
              }}>
                Platform monitoring tanaman profesional dengan teknologi IoT dan AI
                untuk memastikan setiap tanaman Anda tumbuh optimal.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '18px 36px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: 700,
                    fontSize: '17px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(16,185,129,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(16,185,129,0.3)';
                  }}
                >
                  <span style={{ fontSize: '22px' }}>🌱</span>
                  Mulai Sekarang
                </button>
                {/* <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '18px 36px',
                    background: 'white',
                    color: '#1F2937',
                    border: '2px solid #E5E7EB',
                    borderRadius: '16px',
                    fontWeight: 700,
                    fontSize: '17px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#10B981';
                    e.target.style.color = '#10B981';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.color = '#1F2937';
                  }}
                >
                  ▶️ Watch Demo ({count})
                </button> */}
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px'
              }}>
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="card-hover"
                    style={{
                      textAlign: 'center',
                      background: 'white',
                      padding: '20px 12px',
                      borderRadius: '20px',
                      border: '1px solid #F3F4F6',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>{stat.emoji}</div>
                    <div style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: stat.color,
                      marginBottom: '2px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Animated Visual */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div className="animate-float" style={{
                width: '420px',
                height: '420px',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06), rgba(59,130,246,0.06))',
                borderRadius: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 30px 60px rgba(16,185,129,0.1)'
              }}>
                <span style={{ fontSize: '200px' }}>🌿</span>

                {/* Floating Card 1 */}
                <div className="animate-float-delayed" style={{
                  position: 'absolute',
                  top: '30px',
                  right: '-20px',
                  background: 'white',
                  padding: '18px 24px',
                  borderRadius: '24px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    background: '#10B981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 0 15px rgba(16,185,129,0.5)'
                  }}></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#1F2937' }}>Live Monitor</div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Active Now</div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="animate-float" style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '-20px',
                  background: 'white',
                  padding: '18px 24px',
                  borderRadius: '24px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Plant Health</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#10B981' }}>98%</div>
                </div>

                {/* Floating Card 3 */}
                <div className="animate-float-delayed" style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-40px',
                  background: 'white',
                  padding: '14px 20px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '24px' }}>☀️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1F2937' }}>24°C</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Optimal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section id="laporan" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: 'rgba(139,92,246,0.1)',
              borderRadius: '50px',
              marginBottom: '24px',
              border: '1px solid rgba(139,92,246,0.2)'
            }}>
              <span style={{ fontSize: '18px' }}>✨</span>
              <span style={{
                color: '#7C3AED',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Layanan Profesional
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(34px, 4vw, 50px)',
              fontWeight: 900,
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              <span className="gradient-text-colorful">Solusi Lengkap</span>
              <br />
              <span style={{ color: '#1F2937' }}>Untuk Tanaman Anda</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Kami menyediakan berbagai layanan monitoring untuk memastikan tanaman Anda selalu dalam kondisi prima
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}>
            {services.map((service, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: 'white',
                  padding: '44px 36px',
                  borderRadius: '32px',
                  border: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: service.color
                }}></div>

                <div style={{
                  width: '72px',
                  height: '72px',
                  background: service.bgLight,
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  marginBottom: '28px'
                }}>
                  {service.emoji}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginBottom: '14px',
                  color: '#1F2937'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: 1.7
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="about" style={{
        padding: '100px 24px',
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              background: 'rgba(59,130,246,0.1)',
              borderRadius: '50px',
              marginBottom: '24px',
              border: '1px solid rgba(59,130,246,0.2)'
            }}>
              <span style={{ fontSize: '18px' }}>👋</span>
              <span style={{
                color: '#2563EB',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Tim Kami
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(34px, 4vw, 50px)',
              fontWeight: 900,
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              <span style={{ color: '#1F2937' }}>Di Balik</span>{' '}
              <span className="gradient-text-green">PlantLog</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Kami adalah tim profesional yang passionate dalam menggabungkan teknologi dan botani
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            marginBottom: '72px'
          }}>
            {team.map((member, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: 'white',
                  padding: '44px 28px',
                  borderRadius: '32px',
                  textAlign: 'center',
                  border: '1px solid #F3F4F6',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: member.color
                }}></div>

                <div style={{
                  fontSize: '72px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                }}>
                  {member.emoji}
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: '#1F2937'
                }}>
                  {member.name}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: member.color,
                  fontWeight: 600,
                  marginBottom: '10px'
                }}>
                  {member.role}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#9CA3AF'
                }}>
                  {member.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div style={{
            maxWidth: '850px',
            margin: '0 auto',
            padding: '56px 48px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '36px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(16,185,129,0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '150px',
              height: '150px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '50%'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '52px', marginBottom: '24px' }}>💚</div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 800,
                marginBottom: '20px',
                letterSpacing: '-0.5px'
              }}>
                Misi Kami
              </h3>
              <p style={{
                fontSize: '18px',
                lineHeight: 1.8,
                opacity: 0.95,
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Membantu setiap orang menjadi plant parent yang lebih baik melalui teknologi
                yang mudah diakses. Kami percaya bahwa setiap tanaman berhak mendapatkan
                perawatan terbaik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(34px, 4vw, 50px)',
              fontWeight: 900,
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              <span style={{ color: '#1F2937' }}>Apa Kata</span>{' '}
              <span className="gradient-text-green">Mereka?</span>
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280' }}>
              Dipercaya oleh ribuan plant parents di seluruh Indonesia
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px'
          }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: 'white',
                  padding: '44px 36px',
                  borderRadius: '32px',
                  border: '1px solid #F3F4F6'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {t.emoji}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#F59E0B', fontSize: '20px', marginRight: '2px' }}>⭐</span>
                  ))}
                </div>
                <p style={{
                  fontSize: '17px',
                  color: '#4B5563',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                  fontStyle: 'italic'
                }}>
                  "{t.text}"
                </p>
                <div style={{
                  borderTop: '1px solid #F3F4F6',
                  paddingTop: '20px'
                }}>
                  <div style={{ fontWeight: 700, color: '#1F2937', fontSize: '16px' }}>{t.name}</div>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '2px' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            padding: '64px 48px',
            background: 'linear-gradient(135deg, #1F2937, #111827)',
            borderRadius: '40px',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '220px',
              height: '220px',
              background: 'rgba(16,185,129,0.15)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '180px',
              height: '180px',
              background: 'rgba(59,130,246,0.12)',
              borderRadius: '50%'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                fontWeight: 900,
                marginBottom: '16px',
                letterSpacing: '-0.5px'
              }}>
                Siap Merawat Tanaman dengan Lebih Baik? 🌱
              </h2>
              <p style={{
                fontSize: '18px',
                opacity: 0.8,
                marginBottom: '36px',
                lineHeight: 1.7,
                maxWidth: '500px',
                margin: '0 auto 36px'
              }}>
                Bergabunglah dengan 10,000+ plant parents yang sudah mempercayai PlantLog
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '18px 40px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(16,185,129,0.4)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(16,185,129,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(16,185,129,0.4)';
                }}
              >
                🌱 Mulai Gratis Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer id="contact" style={{
        background: '#111827',
        color: 'white',
        padding: '80px 24px 32px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            marginBottom: '64px'
          }}>

            {/* Brand */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800
                }}>
                  P
                </div>
                <span style={{ fontSize: '22px', fontWeight: 800 }}>
                  PLANT<span style={{ color: '#9CA3AF', fontWeight: 500 }}>LOG</span>
                </span>
              </div>
              <p style={{
                color: '#9CA3AF',
                lineHeight: 1.7,
                fontSize: '15px',
                maxWidth: '300px'
              }}>
                Platform monitoring tanaman profesional pertama di Indonesia.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '20px',
                color: '#E5E7EB'
              }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Home', 'About', 'Laporan', 'Katalog', 'Blog'].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    style={{
                      color: '#9CA3AF',
                      textDecoration: 'none',
                      fontSize: '15px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#10B981'}
                    onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '20px',
                color: '#E5E7EB'
              }}>
                Contact Us
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF', fontSize: '15px' }}>
                  <span style={{ fontSize: '18px' }}>📧</span> hello@plantlog.id
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF', fontSize: '15px' }}>
                  <span style={{ fontSize: '18px' }}>📞</span> +62 812-3456-7890
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF', fontSize: '15px' }}>
                  <span style={{ fontSize: '18px' }}>📍</span> Jakarta, Indonesia
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '20px',
                color: '#E5E7EB'
              }}>
                Newsletter
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '15px', marginBottom: '16px' }}>
                Dapatkan tips perawatan tanaman setiap minggu
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Email Anda"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #374151',
                    background: '#1F2937',
                    color: 'white',
                    fontSize: '14px',
                    flex: 1,
                    outline: 'none',
                    minWidth: '150px'
                  }}
                />
                <button style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap'
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>
              © 2026 PlantLog. Made with 💚 for plant lovers.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: '#6B7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#10B981'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontSize: '22px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(16,185,129,0.4)',
            zIndex: 50,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.boxShadow = '0 15px 40px rgba(16,185,129,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(16,185,129,0.4)';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Home;