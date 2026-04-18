import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FallingPattern } from '@/components/ui/falling-pattern';

const BG_IMAGE = 'https://www.image2url.com/r2/default/images/1776506071031-a6408ea8-68c2-40ae-b7be-773bb71eab75.jpg';

export default function App() {
  const [step, setStep] = useState<'overlay' | 'video' | 'content'>('overlay');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.addEventListener('canplaythrough', () => setVideoLoaded(true), { once: true });
    const timer = setTimeout(() => setVideoLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll animations observer
  useEffect(() => {
    if (step !== 'content') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.scroll-hidden');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [step]);

  const handleEnter = useCallback(() => {
    setStep('video');
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => setStep('content'));
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setStep('content');
  }, []);

  useEffect(() => {
    if (step !== 'video') return;
    const timer = setTimeout(() => {
      setStep((c) => (c === 'video' ? 'content' : c));
    }, 6500);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div
      className="relative min-h-screen text-white overflow-x-hidden"
      style={{
        background: `url(${BG_IMAGE}) center/cover no-repeat fixed`,
      }}
    >
      {/* Video de fondo */}
      <video
        ref={videoRef}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        onEnded={handleVideoEnded}
        className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
        style={{ opacity: step === 'video' ? 1 : 0 }}
      >
        <source src="./video/intro.webm" type="video/webm" />
        <source src="./video/intro.mp4" type="video/mp4" />
      </video>

      {/* Frame final */}
      <img
        src="./images/final-frame.jpg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover z-[1] transition-opacity duration-1000"
        style={{ opacity: step === 'content' ? 1 : 0 }}
      />

      {/* ===== OVERLAY INICIAL ===== */}
      <AnimatePresence>
        {step === 'overlay' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Falling Pattern */}
            <div className="absolute inset-0">
              <FallingPattern
                color="rgba(0, 180, 255, 0.4)"
                backgroundColor="#000000"
                duration={40}
                blurIntensity="1.2em"
                density={1.5}
                className="[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 z-[2]" />

            {/* Botón Glassmorphism Cristal Líquido */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={handleEnter}
              disabled={!videoLoaded}
              className="liquid-glass-btn relative z-10"
            >
              <span className="btn-text">Te estabamos esperando... adelante</span>
              <span className="btn-shimmer" />
              <span className="btn-glow" />

              {!videoLoaded && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm z-20">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: step === 'content' ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="relative z-10"
        style={{ pointerEvents: step === 'content' ? 'auto' : 'none' }}
      >
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-black/30 to-black/60">
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 40, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
            style={{
              background: 'linear-gradient(135deg, #fff 30%, #7ec8ff 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(0,150,255,0.25))',
            }}
          >
            MANALF
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
          >
            Soluciones tecnologicas innovadoras para transformar tu negocio.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.8 }}
            href="#productos"
            className="scroll-hidden inline-flex items-center gap-2 px-9 py-3.5 rounded-full bg-[rgba(0,150,255,0.12)] border border-[rgba(0,180,255,0.25)] text-[#7ec8ff] font-medium transition-all duration-300 hover:bg-[rgba(0,150,255,0.28)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,150,255,0.2)] backdrop-blur-lg"
          >
            Explorar soluciones &rarr;
          </motion.a>
        </section>

        {/* Productos */}
        <section id="productos" className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <h2 className="scroll-hidden text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            Sistemas Desarrollados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <GlassCard icon="⚙️" title="Sistema ERP" desc="Gestion integral de recursos empresariales con modulos personalizables para tu industria" />
            <GlassCard icon="📊" title="Analytics Dashboard" desc="Visualizacion de datos en tiempo real con reportes avanzados y analisis predictivo" />
            <GlassCard icon="🔐" title="Security Suite" desc="Proteccion completa con cifrado empresarial y gestion de accesos centralizada" />
          </div>
        </section>

        {/* Servicios */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <h2 className="scroll-hidden text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard title="Consultoria" desc="Asesoramiento estrategico en transformacion digital y optimizacion de procesos" />
            <GlassCard title="Desarrollo Personalizado" desc="Soluciones a medida disenadas especificamente para tus necesidades operativas" />
            <GlassCard title="Implementacion" desc="Despliegue e integracion completa con tus sistemas existentes sin interrupciones" />
            <GlassCard title="Soporte 24/7" desc="Asistencia tecnica continua con garantia de respuesta inmediata" />
            <GlassCard title="Capacitacion" desc="Programas de formacion integral para tu equipo con certificaciones incluidas" />
            <GlassCard title="Mantenimiento" desc="Actualizaciones periodicas y optimizacion constante de tu infraestructura" />
          </div>
        </section>

        {/* Habilidades y Puntos Fuertes */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <h2 className="scroll-hidden text-3xl md:text-5xl font-bold text-center mb-6 tracking-tight">
            Habilidades & Puntos Fuertes
          </h2>
          <p className="scroll-hidden text-center text-white/60 max-w-2xl mx-auto mb-16 text-lg">
            Mas de una decada transformando desafios tecnologicos en ventajas competitivas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard icon="🚀" label="Alta Performance" value="99.9%" sub="Uptime garantizado" />
            <SkillCard icon="⚡" label="Tiempo de Respuesta" value="&lt;2h" sub="Soporte critico" />
            <SkillCard icon="🛡️" label="Seguridad" value="Enterprise" sub="Cifrado AES-256" />
            <SkillCard icon="📈" label="Proyectos" value="150+" sub="Implementados" />
            <SkillCard icon="🔧" label="Tecnologias" value="40+" sub="Stack integrado" />
            <SkillCard icon="🌍" label="Presencia" value="8" sub="Paises LATAM" />
            <SkillCard icon="👥" label="Clientes" value="80+" sub="Empresas activas" />
            <SkillCard icon="🏆" label="Experiencia" value="12 años" sub="En el mercado" />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-16 px-6 text-white/30 text-sm border-t border-white/[0.04]">
          <p>&copy; 2026 MANALF. Todos los derechos reservados.</p>
        </footer>
      </motion.div>
    </div>
  );
}

/* ===== GLASS CARD UNIFICADO ===== */
function GlassCard({ icon, title, desc }: { icon?: string; title: string; desc: string }) {
  return (
    <div className="scroll-hidden group relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 transition-all duration-500 hover:bg-white/[0.08] hover:border-[rgba(0,180,255,0.2)] hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,100,200,0.1)] hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,150,255,0.06)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      {icon && <div className="text-4xl mb-4 relative z-10">{icon}</div>}
      <h3 className="text-lg font-semibold mb-3 relative z-10 text-white/95">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}

/* ===== SKILL CARD ===== */
function SkillCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div className="scroll-hidden group relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-7 text-center transition-all duration-500 hover:bg-white/[0.08] hover:border-[rgba(0,180,255,0.2)] hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,100,200,0.1)] hover:scale-[1.03]">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,150,255,0.06)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <div className="text-3xl mb-3 relative z-10">{icon}</div>
      <div className="text-sm text-white/50 mb-1 relative z-10">{label}</div>
      <div className="text-2xl font-bold mb-1 relative z-10" style={{ background: 'linear-gradient(135deg, #fff, #7ec8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {value}
      </div>
      <div className="text-xs text-white/40 relative z-10">{sub}</div>
    </div>
  );
}
