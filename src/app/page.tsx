"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Lenis from "lenis";

const COLLECTIONS = [
  {
    id: "01",
    title: "Heritage Linen",
    cat: "Premium Kumaş",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000",
    desc: "Nesiller boyu süren ustalıkla dokunan, zamansız keten koleksiyonu"
  },
  {
    id: "02",
    title: "Soft Touch",
    cat: "Ev Tekstili",
    img: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?q=80&w=1000",
    desc: "Konfor ve zarafetin buluştuğu modern ev tekstil çözümleri"
  },
  {
    id: "03",
    title: "Artisan Weave",
    cat: "El Dokuması",
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000",
    desc: "Geleneksel dokuma tekniklerinin modern yorumu"
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-hidden">

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full px-6 md:px-12 py-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-light text-2xl tracking-tight"
        >
          EkolHome
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.2em] font-light">
          <a href="#collections" className="hover:text-gray-400 transition-colors">Koleksiyonlar</a>
          <a href="#heritage" className="hover:text-gray-400 transition-colors">EkolHome</a>
          <a href="#contact" className="hover:text-gray-400 transition-colors">İletişim</a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 right-0 w-full h-screen bg-white z-40 flex flex-col justify-center items-center gap-8 text-3xl uppercase tracking-wider md:hidden"
      >
        <a href="#collections" onClick={() => setMenuOpen(false)}>Koleksiyonlar</a>
        <a href="#heritage" onClick={() => setMenuOpen(false)}>EkolHome</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>İletişim</a>
      </motion.div>
      <br />
      {/* --- Hero Section --- */}
      <section className="relative h-screen flex flex-col justify-center px-6 md:px-12 pt-20">
        <motion.div style={{ opacity }}>
          <div className="overflow-hidden mb-4">
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light"
            >
              Köklü Bir EkolHome
            </motion.div>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-[15vw] md:text-[12vw] font-light leading-[0.85] tracking-tighter"
            >
              Ustalıkla<br />
              <span className="font-extralight italic text-gray-400">Şekillenen</span><br />
              Tekstil Sanatı
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-black/10 pt-8 max-w-5xl"
          >
            <p className="max-w-sm text-sm leading-relaxed text-gray-600 font-light">
              Nesiller boyu süren zanaat geleneği ile modern tasarımı harmanlayarak,
              her dokuşta hikaye anlatan kumaşlar yaratıyoruz.
            </p>

            <div className="flex items-center gap-4 group cursor-pointer">
              <span className="text-xs uppercase tracking-[0.25em] font-light">Koleksiyonu Keşfet</span>
              <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-[1px] h-16 bg-gradient-to-b from-transparent via-black/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* --- Collections Section --- */}
      <section id="collections" className="py-32 md:py-48 px-6 md:px-12 space-y-48">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h2 className="text-5xl md:text-7xl font-light tracking-tight">Koleksiyonlarımız</h2>
          <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Her Desen Bir Hikaye</p>
        </motion.div>

        {COLLECTIONS.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 aspect-[3/4] overflow-hidden group">
              <motion.img
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6 }}
                src={collection.img}
                className="w-full h-full object-cover"
                alt={collection.title}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

              {/* Category Tag */}
              <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.25em] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                {collection.cat}
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
              <div className="space-y-2">
                <span className="text-gray-300 font-light text-6xl">{collection.id}</span>
                <h3 className="text-4xl md:text-6xl font-light tracking-tight leading-none">
                  {collection.title}
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed max-w-md font-light">
                {collection.desc}
              </p>

              <div className="flex items-center gap-3 group cursor-pointer pt-4">
                <span className="text-xs uppercase tracking-[0.25em] font-light border-b border-black/0 group-hover:border-black/100 transition-all pb-1">
                  Detayları İncele
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- Heritage Section --- */}
      <section id="heritage" className="py-32 md:py-48 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Hakkımızda</div>
              <h2 className="text-5xl md:text-6xl font-light tracking-tight leading-tight">
                Gelenekten<br />Geleceğe<br />
                <span className="italic text-gray-400">Uzanan Bir Yolculuk</span>
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed font-light">
              <p>
                Kuşaklar boyu süren deneyim ve özenle geliştirdiğimiz zanaat,
                her ürünümüzde yaşamaya devam ediyor.
              </p>
              <p>
                Modern teknoloji ile geleneksel ustalığı harmanlayarak,
                zamana meydan okuyan, sürdürülebilir ve estetik tekstil çözümleri sunuyoruz.
              </p>
            </div>

            <div className="flex gap-12 pt-8 border-t border-black/10">
              <div>
                <div className="text-4xl font-light">40+</div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mt-2">Yıllık Deneyim</div>
              </div>
              <div>
                <div className="text-4xl font-light">100%</div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mt-2">El İşçiliği</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[3/4] bg-gray-200 overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000"
              className="w-full h-full object-cover"
              alt="Atölye"
            />
          </motion.div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section id="contact" className="h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <h2 className="text-[10vw] md:text-[8vw] font-light tracking-tighter leading-none">
            Hayalinizdeki<br />
            Kumaşı Birlikte<br />
            <span className="italic text-gray-400">Yaratalım</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-black text-white text-xs uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors">
              İletişime Geç
            </button>
            <button className="px-8 py-4 border border-black text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-colors">
              Katalog İndir
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-black/10 px-6 md:px-12 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-2xl font-light">EkolHome</div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Nesiller boyu süren tekstil ustalığı ve modern tasarım anlayışı.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-gray-400">İletişim</div>
            <div className="space-y-2 text-sm font-light text-gray-600">
              <div>info@EkolHometekstil.com</div>
              <div>+90 212 XXX XX XX</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-gray-400">Takip Edin</div>
            <div className="flex gap-6 text-sm font-light">
              <a href="#" className="hover:text-gray-400 transition-colors">Instagram</a>
              <a href="#" className="hover:text-gray-400 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Pinterest</a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>© 2026 EkolHome Tekstil. Tüm hakları saklıdır.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-black transition-colors">Kullanım Koşulları</a>
          </div>
        </div>
      </footer>

    </main>
  );
}