"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, X, Sparkles, CheckCircle2, Star, TrendingUp, Award } from "lucide-react";
import Lenis from "lenis";
import Link from "next/link";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // API'den hizmetleri çek
  useEffect(() => {
    fetch("https://ekolhome.smusa9883x.workers.dev/api/services")
      .then(res => res.json())
      .then(data => {
        setServices(data.slice(0, 6)); // İlk 6 hizmeti göster
        setLoading(false);
      })
      .catch(err => {
        console.error("Hizmetler yüklenemedi:", err);
        setLoading(false);
      });
  }, []);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const stats = [
    { value: "40+", label: "Yıllık Deneyim", icon: <Award size={20} /> },
    { value: "500+", label: "Tamamlanan Proje", icon: <CheckCircle2 size={20} /> },
    { value: "%98", label: "Müşteri Memnuniyeti", icon: <Star size={20} /> },
    { value: "24/7", label: "Destek Hizmeti", icon: <TrendingUp size={20} /> }
  ];

  return (
    <main className="bg-white text-black selection:bg-amber-500 selection:text-white overflow-x-hidden">

      {/* Hero Section - Modern & Dynamic */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"></div>

        <motion.div style={{ opacity, scale }} className="relative z-10">
          {/* Badge */}
          <div className="overflow-hidden mb-6">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-2 rounded-full"
            >
              <Sparkles className="text-amber-500" size={16} />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">
                Profesyonel Tekstil Çözümleri
              </span>
            </motion.div>
          </div>

          {/* Main Heading */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-light leading-[0.9] tracking-tight max-w-6xl"
            >
              Hayalinizdeki
              <br />
              <span className="font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Tekstil Dünyası
              </span>
              <br />
              <span className="font-extralight text-gray-400 italic">Bir Tık Uzağınızda</span>
            </motion.h1>
          </div>

          {/* Description & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-t border-gray-200 pt-10 max-w-6xl"
          >
            <p className="max-w-xl text-lg md:text-xl leading-relaxed text-gray-600 font-light">
              Nesiller boyu süren deneyimimiz ve modern teknolojimizle,
              <strong className="text-black font-medium"> ev tekstilinden otel çözümlerine</strong> kadar
              her alanda üstün kalite sunuyoruz.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + idx * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition-all group"
              >
                <div className="text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-light mb-1">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section - API'den Dinamik */}
      <section id="services" className="py-24 md:py-32 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Hizmetlerimiz</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
              Size Özel Çözümler
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Her ihtiyaca uygun profesyonel tekstil hizmetleri
            </p>
          </motion.div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/hizmetlerimiz/${service.id}`}>
                    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 h-full">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {service.cover_image && service.cover_image !== "" ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            src={service.cover_image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles size={48} className="text-gray-300" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Category Badge */}
                        {service.category && (
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              {service.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <h3 className="text-2xl font-light tracking-tight leading-tight group-hover:text-amber-600 transition-colors">
                          {service.title}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed font-light line-clamp-3">
                          {service.description}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold pt-2 group-hover:gap-4 transition-all">
                          <span>Detayları Gör</span>
                          <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/hizmetlerimiz"
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl group"
            >
              <span className="text-sm font-semibold tracking-wide">Tüm Hizmetleri Gör</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000"
                className="w-full h-full object-cover"
                alt="EkolHome Atölye"
              />

              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-light">40+ Yıl</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Sektör Deneyimi</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
                  <span className="text-xs font-semibold uppercase tracking-wider">Hakkımızda</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                  Gelenekten Geleceğe
                  <br />
                  <span className="font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Uzanan Yolculuk
                  </span>
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light">
                <p>
                  Kuşaklar boyu süren deneyim ve özenle geliştirdiğimiz zanaat,
                  her ürünümüzde yaşamaya devam ediyor.
                </p>
                <p>
                  Modern teknoloji ile geleneksel ustalığı harmanlayarak,
                  zamana meydan okuyan, sürdürülebilir ve estetik tekstil çözümleri sunuyoruz.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                {[
                  { icon: <CheckCircle2 size={20} />, text: "Kalite Garantisi" },
                  { icon: <Star size={20} />, text: "Müşteri Odaklı" },
                  { icon: <TrendingUp size={20} />, text: "Hızlı Teslimat" },
                  { icon: <Award size={20} />, text: "Ödüllü Hizmet" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <div className="text-amber-500">{feature.icon}</div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/hakkimizda"
                className="inline-flex items-center gap-3 text-amber-600 font-semibold hover:gap-5 transition-all group"
              >
                <span>Hikayemizi Keşfet</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto text-center text-white space-y-12"
        >
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
              Hayalinizdeki Projeyi
              <br />
              <span className="font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Birlikte Gerçekleştirelim
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Uzman ekibimiz, size özel çözümler sunmaya hazır
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/iletisim" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold uppercase tracking-wider rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-2xl">
                İletişime Geç
              </button>
            </Link>

            <Link href="/katalog" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 border-2 border-white text-white text-sm font-semibold uppercase tracking-wider rounded-xl hover:bg-white hover:text-gray-900 transition-all">
                Kataloğu İncele
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}