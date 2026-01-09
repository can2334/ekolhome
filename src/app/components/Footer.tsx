import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-black/10 px-6 md:px-12 py-16 bg-white">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                {/* Logo ve Tanıtım */}
                <div className="space-y-4">
                    <div className="text-2xl font-light tracking-tighter">
                        EKOL<span className="font-thin italic lowercase">home</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-xs uppercase tracking-wider">
                        Nesiller boyu süren tekstil ustalığı ve modern tasarım anlayışı.
                    </p>
                </div>

                {/* İletişim Bilgileri */}
                <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">İletişim</div>
                    <div className="space-y-2 text-sm font-light text-gray-600">
                        <div className="hover:italic cursor-pointer transition-all">info@ekolhometekstil.com</div>
                        <div className="hover:italic cursor-pointer transition-all">+90 212 XXX XX XX</div>
                    </div>
                </div>

                {/* Sosyal Medya */}
                <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Takip Edin</div>
                    <div className="flex gap-6 text-sm font-light">
                        <a href="#" className="hover:italic transition-all">Instagram</a>
                        <a href="#" className="hover:italic transition-all">LinkedIn</a>
                        <a href="#" className="hover:italic transition-all">Pinterest</a>
                    </div>
                </div>
            </div>

            {/* Alt Bilgi ve Yasal Haklar */}
            <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-gray-400">
                <div>© 2026 EkolHome Tekstil. Tüm hakları saklıdır.</div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-black transition-colors">Gizlilik Politikası</a>
                    <a href="#" className="hover:text-black transition-colors">Kullanım Koşulları</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;