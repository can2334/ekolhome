"use client";

import { useState, useEffect } from "react";
import {
    Settings, Globe, ShieldCheck, Bell, Palette, Save, Cpu, Lock,
    Mail, Database, TrendingUp, Activity, Eye, EyeOff, Copy, Check,
    RefreshCw, Download, Monitor, Smartphone, Code, Terminal, Zap,
    HardDrive, Wifi, Server, BarChart3, Users, FileText
} from "lucide-react";

const SettingCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 backdrop-blur-sm hover:border-amber-500/30 transition-all">
        <div className="mb-4">
            <h3 className="text-amber-500 text-xs font-black tracking-widest uppercase">{title}</h3>
            <p className="text-gray-400 text-[10px] uppercase mt-1">{description}</p>
        </div>
        {children}
    </div>
);
const WORKER_URL = "https://ekolhome.smusa9883x.workers.dev";
export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('genel');
    const [showApiKey, setShowApiKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);
    const [notifications, setNotifications] = useState({ email: true, push: false, sms: true });
    const [stats, setStats] = useState({ uptime: 99.8, requests: 45678, storage: 67, users: 1234 });
    const [theme, setTheme] = useState('dark');
    const [formData, setFormData] = useState({
        siteTitle: 'EKOL HOME',
        slogan: 'ESTETİĞİN YENİ ADRESİ',
        email: 'admin@ekolhome.com',
        phone: '+90 555 123 4567',
        metaDescription: '',
        googleAnalytics: '',
        searchConsole: ''
    });
    const [security, setSecurity] = useState({
        ipWhitelist: false,
        bruteForceProtection: true,
        sessionTimeout: true,
        autoLogout: true
    });
    const [integrations, setIntegrations] = useState({
        stripe: true,
        mailchimp: true,
        analytics: false,
        cloudflare: true
    });
    const [systemInfo, setSystemInfo] = useState<any>(null);

    // Cloudflare Worker'dan ayarları yükle
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`${WORKER_URL}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData(data.formData || formData);
                    setMaintenanceMode(data.maintenanceMode || false);
                    setTwoFactor(data.twoFactor || true);
                    setNotifications(data.notifications || notifications);
                    setTheme(data.theme || 'dark');
                    setSecurity(data.security || security);
                    setIntegrations(data.integrations || integrations);
                }
            } catch (err) {
                console.error("Ayarlar yüklenemedi:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const loadSystemInfo = async () => {
            try {
                const res = await fetch(`${WORKER_URL}/api/system`);
                if (res.ok) {
                    const data = await res.json();
                    setSystemInfo(data);
                }
            } catch (err) {
                console.error("Sistem bilgileri yüklenemedi:", err);
            }
        };

        loadSettings();
        loadSystemInfo();

        // Stats'ı gerçek zamanlı güncelle
        const statsInterval = setInterval(async () => {
            try {
                const res = await fetch(`${WORKER_URL}/api/stats`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                // Fallback to local simulation
                setStats(prev => ({
                    uptime: Math.min(99.9, prev.uptime + Math.random() * 0.01),
                    requests: prev.requests + Math.floor(Math.random() * 10),
                    storage: Math.min(100, prev.storage + Math.random() * 0.1),
                    users: prev.users + Math.floor(Math.random() * 3)
                }));
            }
        }, 3000);

        return () => clearInterval(statsInterval);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-xs z-50';
            notification.innerHTML = '✓ AYARLAR GÜNCELLENDİ';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
        }, 1500);
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText('s3nnzywalker_r2_secure_2026');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const exportSettings = async () => {
        try {
            const res = await fetch(`${WORKER_URL}/api/settings/export`, {
                method: 'POST'
            });
            if (res.ok) {
                const data = await res.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ekol-settings-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Export hatası:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center">
                    <Cpu className="text-amber-500 animate-spin mx-auto mb-4" size={48} />
                    <p className="text-white text-xs font-black uppercase">CLOUDFLARE KV BAĞLANTISI KURULUYOR...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'genel', icon: Globe, label: 'Genel' },
        { id: 'gorunum', icon: Palette, label: 'Görünüm' },
        { id: 'guvenlik', icon: ShieldCheck, label: 'Güvenlik' },
        { id: 'bildirimler', icon: Bell, label: 'Bildirimler' },
        { id: 'api', icon: Code, label: 'API & Entegrasyonlar' },
        { id: 'sistem', icon: Terminal, label: 'Sistem & Performans' }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans uppercase tracking-tight">
            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Settings className="text-amber-500 animate-pulse" size={20} />
                            <h1 className="text-xl font-black">SİSTEM AYARLARI</h1>
                        </div>
                        <p className="text-gray-500 text-[10px]">EKOL HOME // YÖNETİM PANELİ v2.0.26</p>
                        deneyseldir gercek verıler değildir.
                    </div>
                    <div className="flex gap-2">
                        <button onClick={exportSettings} className="bg-white/5 text-white px-4 py-3 rounded-full text-[10px] font-black hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10">
                            <Download size={14} /> YEDEKLE
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-amber-500 text-black px-6 py-3 rounded-full text-[10px] font-black hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50">
                            {isSaving ? <Cpu className="animate-spin" size={14} /> : <Save size={14} />}
                            {isSaving ? "İŞLENİYOR..." : "UYGULA"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-amber-500" size={16} />
                            <span className="text-[9px] text-gray-400">UPTIME</span>
                        </div>
                        <p className="text-2xl font-black text-amber-500">{stats.uptime.toFixed(2)}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-blue-500" size={16} />
                            <span className="text-[9px] text-gray-400">API REQUESTS</span>
                        </div>
                        <p className="text-2xl font-black text-blue-500">{stats.requests.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="text-purple-500" size={16} />
                            <span className="text-[9px] text-gray-400">STORAGE</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-2xl font-black text-purple-500">{stats.storage.toFixed(1)}%</p>
                            <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{ width: `${stats.storage}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="text-green-500" size={16} />
                            <span className="text-[9px] text-gray-400">ACTIVE USERS</span>
                        </div>
                        <p className="text-2xl font-black text-green-500">{stats.users.toLocaleString()}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3 space-y-2">
                    {tabs.map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${activeTab === item.id ? 'bg-amber-500/10 border border-amber-500/50 text-amber-500' : 'bg-white/5 border border-transparent hover:border-amber-500/30 hover:bg-amber-500/5'}`}>
                            <item.icon size={16} className={activeTab === item.id ? 'text-amber-500' : 'text-gray-500 group-hover:text-amber-500'} />
                            <span className="text-[10px] font-bold">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="md:col-span-9">
                    {activeTab === 'genel' && (
                        <div className="space-y-4">
                            <SettingCard title="SİTE KİMLİĞİ" description="Ekol Home ana marka ve meta verileri">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 ml-1">SİTE BAŞLIĞI</label>
                                        <input type="text" value={formData.siteTitle} onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-amber-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 ml-1">SLOGAN</label>
                                        <input type="text" value={formData.slogan} onChange={(e) => setFormData({ ...formData, slogan: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-amber-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 ml-1">İLETİŞİM E-POSTA</label>
                                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-amber-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 ml-1">TELEFON</label>
                                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-amber-500 transition-all" />
                                    </div>
                                </div>
                            </SettingCard>

                            <SettingCard title="BAKIM MODU" description="Siteyi geçici olarak dış trafiğe kapat">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600 peer-checked:after:bg-white"></div>
                                        </label>
                                        <span className="text-[10px] font-bold uppercase">{maintenanceMode ? 'AKTİF' : 'PASİF'}</span>
                                    </div>
                                    {maintenanceMode && <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1"><span className="text-[9px] text-amber-500 font-black">SİTE KAPATILDI</span></div>}
                                </div>
                            </SettingCard>

                            <SettingCard title="SEO & METAVERİ" description="Arama motoru optimizasyonu">
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 ml-1">META AÇIKLAMA</label>
                                        <textarea rows={3} placeholder="Site açıklaması..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] focus:outline-none focus:border-amber-500 transition-all resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                            <p className="text-[9px] text-gray-500 mb-1">GOOGLE ANALYTICS</p>
                                            <input type="text" placeholder="UA-XXXXXXXXX" className="w-full bg-transparent text-[10px] outline-none" />
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                            <p className="text-[9px] text-gray-500 mb-1">GOOGLE SEARCH CONSOLE</p>
                                            <input type="text" placeholder="Verification Code" className="w-full bg-transparent text-[10px] outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'gorunum' && (
                        <div className="space-y-4">
                            <SettingCard title="TEMA AYARLARI" description="Görsel tercihler ve renkler">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['dark', 'light', 'amber', 'blue'].map((t) => (
                                        <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 transition-all ${theme === t ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                                            <div className={`w-full h-12 rounded-lg mb-2 ${t === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : t === 'light' ? 'bg-gradient-to-br from-white to-gray-200' : t === 'amber' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`} />
                                            <p className="text-[9px] font-black uppercase">{t}</p>
                                        </button>
                                    ))}
                                </div>
                            </SettingCard>

                            <SettingCard title="CIHAZ GÖRÜNÜMÜ" description="Responsive tasarım optimizasyonu">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                                        <Monitor className="text-blue-500" size={20} />
                                        <div><p className="text-[10px] font-bold">DESKTOP</p><p className="text-[8px] text-gray-500">OPTİMİZE</p></div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                                        <Smartphone className="text-purple-500" size={20} />
                                        <div><p className="text-[10px] font-bold">MOBILE</p><p className="text-[8px] text-gray-500">OPTİMİZE</p></div>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'guvenlik' && (
                        <div className="space-y-4">
                            <SettingCard title="GÜVENLİK & ERİŞİM" description="Yönetici yetkilendirme">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Lock className="text-amber-500" size={16} />
                                            <div><p className="text-[10px] font-bold">2-FA DOĞRULAMA</p><p className="text-[8px] text-gray-500">MOBİL ONAY</p></div>
                                        </div>
                                        <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} className="accent-amber-500 w-4 h-4 cursor-pointer" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-gray-500 ml-1">MASTER API KEY</label>
                                        <div className="flex gap-2">
                                            <input type={showApiKey ? "text" : "password"} value="s3nnzywalker_r2_secure_2026" readOnly className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-mono text-amber-500/50" />
                                            <button onClick={() => setShowApiKey(!showApiKey)} className="bg-white/5 px-4 rounded-xl hover:bg-white/10 transition-all border border-white/10">{showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                            <button onClick={copyApiKey} className="bg-white/5 px-4 rounded-xl hover:bg-white/10 transition-all border border-white/10">{copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}</button>
                                            <button className="bg-amber-500/10 border border-amber-500/30 px-4 rounded-xl hover:bg-amber-500/20 transition-all"><RefreshCw size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>

                            <SettingCard title="GİRİŞ GÜVENLİĞİ" description="Şüpheli aktivite koruması">
                                <div className="space-y-3">
                                    {[
                                        { key: 'ipWhitelist', label: 'IP WHITELIST' },
                                        { key: 'bruteForceProtection', label: 'BRUTE FORCE KORUMA' },
                                        { key: 'sessionTimeout', label: 'SESSION TIMEOUT (30 DK)' },
                                        { key: 'autoLogout', label: 'AUTO LOGOUT' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                            <span className="text-[10px] font-bold">{item.label}</span>
                                            <input
                                                type="checkbox"
                                                checked={security[item.key as keyof typeof security]}
                                                onChange={(e) => setSecurity({ ...security, [item.key]: e.target.checked })}
                                                className="accent-amber-500 w-4 h-4 cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'bildirimler' && (
                        <div className="space-y-4">
                            <SettingCard title="BİLDİRİM TERCİHLERİ" description="Uyarı ve iletişim kanalları">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Mail className="text-blue-500" size={18} />
                                            <div><p className="text-[10px] font-bold">E-POSTA</p><p className="text-[8px] text-gray-500">SİSTEM UYARILARI</p></div>
                                        </div>
                                        <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} className="accent-blue-500 w-4 h-4 cursor-pointer" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Bell className="text-purple-500" size={18} />
                                            <div><p className="text-[10px] font-bold">PUSH BİLDİRİMLERİ</p><p className="text-[8px] text-gray-500">TARAYICI VE MOBİL</p></div>
                                        </div>
                                        <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} className="accent-purple-500 w-4 h-4 cursor-pointer" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="text-green-500" size={18} />
                                            <div><p className="text-[10px] font-bold">SMS UYARILARI</p><p className="text-[8px] text-gray-500">ACİL DURUM</p></div>
                                        </div>
                                        <input type="checkbox" checked={notifications.sms} onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })} className="accent-green-500 w-4 h-4 cursor-pointer" />
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="space-y-4">
                            <SettingCard title="API ENDPOINT'LERİ" description="Harici entegrasyon bağlantıları">
                                <div className="space-y-3">
                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <p className="text-[9px] text-gray-500 mb-2">BASE URL</p>
                                        <code className="text-[10px] text-amber-500 font-mono">https://api.ekolhome.com/v2</code>
                                    </div>
                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <p className="text-[9px] text-gray-500 mb-2">WEBHOOK</p>
                                        <code className="text-[10px] text-blue-500 font-mono">https://hooks.ekolhome.com/events</code>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                                            <p className="text-[9px] text-gray-500">STATUS</p>
                                            <p className="text-[11px] font-black text-green-500">ONLINE</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                                            <p className="text-[9px] text-gray-500">RATE LIMIT</p>
                                            <p className="text-[11px] font-black text-blue-500">1000/H</p>
                                        </div>
                                        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                                            <p className="text-[9px] text-gray-500">VERSION</p>
                                            <p className="text-[11px] font-black text-purple-500">v2.0</p>
                                        </div>
                                    </div>
                                </div>
                            </SettingCard>

                            <SettingCard title="ENTEGRASYONLAR" description="3. parti hizmet bağlantıları">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: 'stripe', name: 'STRIPE', color: 'blue' },
                                        { key: 'mailchimp', name: 'MAILCHIMP', color: 'amber' },
                                        { key: 'analytics', name: 'GOOGLE ANALYTICS', color: 'red' },
                                        { key: 'cloudflare', name: 'CLOUDFLARE', color: 'green' }
                                    ].map((integration, i) => (
                                        <div key={i} className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                                            <span className="text-[10px] font-bold">{integration.name}</span>
                                            <div
                                                className={`w-2 h-2 rounded-full ${integrations[integration.key as keyof typeof integrations] ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </SettingCard>
                        </div>
                    )}

                    {activeTab === 'sistem' && (
                        <div className="space-y-4">
                            <SettingCard title="SİSTEM BİLGİLERİ" description="Cloudflare Edge Network metrikleri">
                                {systemInfo ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Server className="text-blue-500" size={16} />
                                                <span className="text-[10px] font-bold">SUNUCU BİLGİSİ</span>
                                            </div>
                                            <div className="space-y-2 text-[9px]">
                                                <div className="flex justify-between"><span className="text-gray-500">OS:</span><span>{systemInfo.server.os}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">CPU:</span><span>{systemInfo.server.cpu}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">RAM:</span><span>{systemInfo.server.ram}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">LOCATION:</span><span className="text-amber-500">{systemInfo.server.location}</span></div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <HardDrive className="text-purple-500" size={16} />
                                                <span className="text-[10px] font-bold">DEPOLAMA</span>
                                            </div>
                                            <div className="space-y-2 text-[9px]">
                                                <div className="flex justify-between"><span className="text-gray-500">TOPLAM:</span><span>{systemInfo.storage.total}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">KULLANILAN:</span><span className="text-amber-500">{systemInfo.storage.used}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">BOŞ:</span><span className="text-green-500">{systemInfo.storage.free}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">TİP:</span><span className="text-purple-500">{systemInfo.storage.type}</span></div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Wifi className="text-green-500" size={16} />
                                                <span className="text-[10px] font-bold">NETWORK</span>
                                            </div>
                                            <div className="space-y-2 text-[9px]">
                                                <div className="flex justify-between"><span className="text-gray-500">IP:</span><span>{systemInfo.network.ip}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">PROVIDER:</span><span className="text-amber-500">{systemInfo.network.provider}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">BANDWIDTH:</span><span className="text-blue-500">{systemInfo.network.bandwidth}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">COUNTRY:</span><span className="text-green-500">{systemInfo.network.country}</span></div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BarChart3 className="text-amber-500" size={16} />
                                                <span className="text-[10px] font-bold">PERFORMANS</span>
                                            </div>
                                            <div className="space-y-2 text-[9px]">
                                                <div className="flex justify-between"><span className="text-gray-500">AVG RESPONSE:</span><span className="text-green-500">{systemInfo.performance.avgResponse}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">ERROR RATE:</span><span className="text-green-500">{systemInfo.performance.errorRate}</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">UPTIME:</span><span className="text-amber-500">{systemInfo.performance.uptime}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Cpu className="text-amber-500 animate-spin mx-auto mb-2" size={24} />
                                        <p className="text-[9px] text-gray-500">SİSTEM BİLGİLERİ YÜKLENIYOR...</p>
                                    </div>
                                )}
                            </SettingCard>

                            <SettingCard title="VERİTABANI" description="Database bağlantı ve yedekleme">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Database className="text-blue-500" size={16} />
                                                <span className="text-[10px] font-bold">CLOUDFLARE KV</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[9px] text-gray-500">BAĞLANTI AKTİF</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="text-amber-500" size={16} />
                                                <span className="text-[10px] font-bold">EDGE CACHE</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[9px] text-gray-500">BAĞLANTI AKTİF</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={exportSettings}
                                            className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-[10px] font-bold hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Download size={14} />
                                            KV YEDEK AL
                                        </button>
                                        <button className="flex-1 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 text-[10px] font-bold hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2">
                                            <RefreshCw size={14} />
                                            CACHE TEMİZLE
                                        </button>
                                    </div>
                                </div>
                            </SettingCard>

                            <SettingCard title="YEDEKLEME AYARLARI" description="Otomatik backup planlaması">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-[10px] font-bold">OTOMATİK YEDEKLEME</p>
                                            <p className="text-[8px] text-gray-500">HER GÜN 03:00'DA</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="accent-amber-500 w-4 h-4 cursor-pointer" />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-[10px] font-bold">CLOUD BACKUP</p>
                                            <p className="text-[8px] text-gray-500">AWS S3 BUCKET</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4 cursor-pointer" />
                                    </div>
                                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                                        <p className="text-[9px] text-gray-400 mb-1">SON YEDEKLEME</p>
                                        <p className="text-[10px] font-black text-green-500">25 OCAK 2026, 03:00</p>
                                    </div>
                                </div>
                            </SettingCard>

                            <SettingCard title="LOG VE İZLEME" description="Sistem kayıtları ve aktivite">
                                <div className="space-y-3">
                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-[9px] max-h-40 overflow-y-auto">
                                        <div className="text-green-500 mb-1">[2026-01-26 14:32:45] INFO: API request successful - /v2/products</div>
                                        <div className="text-blue-500 mb-1">[2026-01-26 14:32:12] DEBUG: Cache hit - user_session_abc123</div>
                                        <div className="text-amber-500 mb-1">[2026-01-26 14:31:58] WARN: Rate limit approaching - IP: 192.168.1.1</div>
                                        <div className="text-green-500 mb-1">[2026-01-26 14:31:45] INFO: Database query optimized - 23ms</div>
                                        <div className="text-purple-500 mb-1">[2026-01-26 14:31:30] INFO: New user registered - ID: 1235</div>
                                        <div className="text-green-500">[2026-01-26 14:31:15] INFO: Payment processed - Order #5678</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[9px] font-bold hover:bg-white/10 transition-all">
                                            TÜMÜNÜ GÖSTER
                                        </button>
                                        <button className="flex-1 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-[9px] font-bold hover:bg-red-500/20 transition-all">
                                            LOGLARI TEMİZLE
                                        </button>
                                    </div>
                                </div>
                            </SettingCard>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Info */}
            <footer className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-gray-500">
                    <div className="flex items-center gap-4">
                        <span>© 2026 EKOL HOME</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">POWERED BY CLOUDFLARE</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">DESIGNED BY S3NNZY</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Database className="text-purple-500" size={12} />
                            <span>CLOUDFLARE KV</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>WORKER ONLINE</span>
                        </div>
                        <span>•</span>
                        <span>v2.0.26</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}