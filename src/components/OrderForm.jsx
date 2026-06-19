import { useState } from "react";
import API_BASE_URL from "../api";

const SERVICES = [
  { id: 1, name: "Yes or No Reading", price: 15000, desc: "Satu kartu untuk jawaban Ya/Tidak/Belum Jelas. Tidak interaktif.", symbol: "✦" },
  { id: 2, name: "Message from the Universe", price: 15000, desc: "Pesan refleksi singkat dari kartu alam semesta.", symbol: "✧" },
  { id: 3, name: "Deep Reading", price: 90000, desc: "Pembacaan mendalam dengan 5 kartu — situasi, akar, emosi, arah.", symbol: "⬟", badge: "5 Cards" },
  { id: 4, name: "Reflection Reading", price: 30000, desc: "Bagaimana energimu terbaca oleh orang-orang di sekitarmu.", symbol: "◈" },
  { id: 5, name: "Dream Interpretation", price: 35000, desc: "Interpretasi simbolik dari cerita dan simbol mimpimu.", symbol: "☽" },
  { id: 6, name: "Past Life Reading", price: 45000, desc: "Pola jiwa yang mungkin terbawa dari kehidupan lampau.", symbol: "∞" },
  { id: 7, name: "Grounding & Aura Insight", price: 25000, desc: "Refleksi untuk kembali ke pusat diri, tenang dan seimbang.", symbol: "◎" },
  { id: 8, name: "General 3-Card Spread", price: 25000, desc: "Pembacaan 3 kartu umum untuk situasi apa pun yang kamu hadapi.", symbol: "⁂", badge: "3 Cards" },
  { id: 9, name: "Love & Relationship Reading", price: 40000, desc: "Pembacaan khusus dinamika dan energi hubunganmu.", symbol: "♡" },
  { id: 10, name: "Celtic Cross", price: 150000, desc: "Pembacaan paling komprehensif — 10 kartu untuk gambaran menyeluruh.", symbol: "✠", badge: "10 Cards", featured: true },
];

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function Stars() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.3 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function MoonSVG() {
  return (
    <svg className="w-[130px] h-[130px] opacity-90 drop-shadow-[0_0_30px_rgba(200,140,80,0.4)] animate-moon-float" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="moonGrad" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8ddd0" />
          <stop offset="40%" stopColor="#c8b8a0" />
          <stop offset="100%" stopColor="#6a4a30" />
        </radialGradient>
        <radialGradient id="craterG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#moonGrad)" />
      <circle cx="70" cy="75" r="12" fill="url(#craterG)" />
      <circle cx="130" cy="110" r="8" fill="url(#craterG)" />
      <circle cx="90" cy="130" r="6" fill="url(#craterG)" />
      <circle cx="150" cy="70" r="10" fill="url(#craterG)" />
      <circle cx="55" cy="120" r="5" fill="url(#craterG)" />
    </svg>
  );
}

export default function OrderForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", instagram: "" });
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const selectedServices = SERVICES.filter((s) => selected[s.id]);
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const toggleService = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email tidak valid";
    if (!form.phone.trim()) e.phone = "Nomor HP wajib diisi";
    if (selectedServices.length === 0) e.services = "Pilih minimal satu layanan";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    setError("");

    try {
      // Endpoint publik untuk customer (tanpa login)
      const res = await fetch(`${API_BASE_URL}/orders/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          instagram: form.instagram,
          items: selectedServices.map((s) => ({ service_id: s.id, quantity: 1 })),
        }),
      });
      const data = await res.json();
      if (data.order_id) {
        setResult({ orderId: data.order_id, total });
        setForm({ name: "", email: "", phone: "", instagram: "" });
        setSelected({});
      } else {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan server aktif.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `bg-cream-faint border border-crimson/50 rounded-sm text-cream font-mono text-sm p-3 outline-none focus:border-gold/50 focus:bg-crimson/20 placeholder:text-cream/30 ${errors[field] ? 'border-crimson-bright' : ''}`;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a0000] via-[#0a0000] to-[#050000] overflow-x-hidden">
      <Stars />

      {/* HEADER */}
      <header className="relative z-10 pt-10 pb-2 text-center px-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl text-gold">✠</span>
          <div>
            <h1 className="font-serif text-3xl font-light tracking-[0.2em] uppercase text-cream">Ateric Tarot</h1>
            <p className="font-mono text-[0.68rem] tracking-[0.35em] uppercase text-gold mt-0.5">astral · intuitive · reflective</p>
          </div>
          <a href="/admin" className="absolute right-4 text-xs tracking-widest text-cream-dim border border-crimson/50 px-3 py-1.5 rounded-sm hover:text-gold hover:border-gold/50 transition">Admin ↗</a>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6 max-w-md mx-auto">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <span className="text-[0.55rem] tracking-[0.5em] text-gold">✦ ✦ ✦</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 text-center py-14 px-4 flex flex-col items-center gap-5">
        <MoonSVG />
        <p className="text-xs tracking-[0.2em] uppercase text-gold">Tarot for reflection, not only prediction.</p>
        <h2 className="font-serif italic text-5xl md:text-6xl font-light leading-tight text-cream">Tentukan<br />hidupmu disini.</h2>
        <p className="text-xs leading-relaxed text-cream-dim max-w-md">
          Gentle guidance through symbols — pengerjaan maks 10 jam.<br />
          Privasi sepenuhnya terjaga. Pembayaran dilakukan sebelum sesi dimulai.
        </p>
      </section>

      {/* FORM CONTAINER */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-24">

        {/* DATA DIRI */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold">◈</span>
            <h3 className="font-serif text-xl tracking-[0.12em] uppercase text-cream border-b border-gold-dim pb-2">Data Diri</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[0.68rem] tracking-[0.18em] uppercase text-cream-dim">Nama Lengkap <span className="text-gold">*</span></label>
              <input type="text" placeholder="nama kamu…" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass('name')} />
              {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.68rem] tracking-[0.18em] uppercase text-cream-dim">Email <span className="text-gold">*</span></label>
              <input type="email" placeholder="email@kamu.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass('email')} />
              {errors.email && <span className="text-xs text-red-300">{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.68rem] tracking-[0.18em] uppercase text-cream-dim">No. HP / WhatsApp <span className="text-gold">*</span></label>
              <input type="tel" placeholder="08xx xxxx xxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass('phone')} />
              {errors.phone && <span className="text-xs text-red-300">{errors.phone}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.68rem] tracking-[0.18em] uppercase text-cream-dim">Instagram</label>
              <input type="text" placeholder="@username" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass('instagram')} />
            </div>
          </div>
        </section>

        {/* PILIH LAYANAN */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold">✦</span>
            <h3 className="font-serif text-xl tracking-[0.12em] uppercase text-cream border-b border-gold-dim pb-2">Pilih Layanan Reading</h3>
          </div>
          {errors.services && <p className="text-xs text-red-300 mb-2">{errors.services}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((svc) => {
              const isChecked = !!selected[svc.id];
              return (
                <div
                  key={svc.id}
                  onClick={() => toggleService(svc.id)}
                  className={`relative bg-crimson/20 border rounded-md p-5 cursor-pointer select-none transition-all duration-200 hover:bg-crimson/30 hover:border-gold/50 hover:-translate-y-1 ${
                    isChecked
                      ? 'border-gold bg-crimson/40 shadow-[0_0_20px_rgba(139,0,0,0.3)]'
                      : 'border-crimson/40'
                  } ${svc.featured ? 'border-gold/50' : ''}`}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === ' ' && toggleService(svc.id)}
                >
                  {svc.featured && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-[#1a0000] text-[0.55rem] font-bold tracking-widest uppercase px-3 py-0.5 rounded-sm whitespace-nowrap">
                      Most Comprehensive
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gold text-lg">{svc.symbol}</span>
                    {svc.badge && <span className="text-[0.55rem] tracking-[0.15em] uppercase text-gold border border-gold-dim px-2 py-0.5 rounded-sm">{svc.badge}</span>}
                    <div className={`ml-auto w-5 h-5 border rounded-sm flex items-center justify-center text-xs transition-all ${
                      isChecked ? 'bg-crimson border-crimson-bright text-cream' : 'border-crimson/50 text-transparent'
                    }`}>
                      {isChecked && <span>✓</span>}
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-normal text-cream mb-1">{svc.name}</h4>
                  <p className="text-xs leading-relaxed text-cream-dim mb-3">{svc.desc}</p>
                  <div className="text-sm font-bold text-gold">{formatRupiah(svc.price)}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ORDER SUMMARY */}
        {selectedServices.length > 0 && (
          <section className="bg-crimson/20 border border-gold-dim rounded-md p-5 mb-6">
            <h4 className="font-serif text-base font-normal tracking-[0.12em] uppercase text-gold mb-4">Ringkasan Pesanan</h4>
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between text-xs text-cream-dim py-1">
                <span>{s.name}</span>
                <span>{formatRupiah(s.price)}</span>
              </div>
            ))}
            <div className="h-px bg-gold-dim my-3" />
            <div className="flex justify-between text-sm font-bold text-cream">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </section>
        )}

        {/* TERMS NOTE */}
        <div className="flex gap-3 text-[0.65rem] leading-relaxed text-cream/40 border-l-2 border-crimson pl-4 mb-6">
          <span className="text-crimson-bright">☽</span>
          Usia minimal 17 tahun. Tidak melayani pertanyaan mengenai identitas seseorang,
          penyakit, kematian, atau barang hilang. Tarot digunakan sebagai bahan refleksi, bukan prediksi mutlak.
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-900/30 border border-crimson-bright text-red-200 text-xs p-3 rounded-sm mb-4">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-crimson border border-gold/40 rounded-sm text-cream font-serif text-lg tracking-[0.25em] uppercase hover:bg-crimson-mid hover:shadow-[0_4px_40px_rgba(139,0,0,0.5)] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="font-mono text-sm tracking-widest text-cream-dim">· · · Memproses</span>
          ) : (
            <>
              <span className="text-gold text-xs">✦</span>
              Pesan Sekarang
              <span className="text-gold text-xs">✦</span>
            </>
          )}
        </button>
      </main>

      {/* SUCCESS MODAL */}
      {result && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-6 animate-fade-in" onClick={() => setResult(null)}>
          <div className="bg-gradient-to-b from-[#1f0000] to-[#0d0000] border border-gold-dim rounded-md p-10 max-w-md w-full text-center animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl text-gold mb-4">☽</div>
            <h3 className="font-serif text-3xl font-light tracking-widest mb-2">Pesanan Diterima</h3>
            <p className="text-xs text-cream-dim mb-4">Terima kasih telah mempercayakan energimu kepada kami.</p>
            <div className="bg-cream-faint border border-crimson/30 rounded-sm p-4 mb-4">
              <div className="flex justify-between text-xs py-1 text-cream-dim">
                <span>Order ID</span>
                <span className="font-bold text-cream">#{result.orderId}</span>
              </div>
              <div className="flex justify-between text-xs py-1 text-cream-dim">
                <span>Total</span>
                <span className="font-bold text-cream">{formatRupiah(result.total)}</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-cream-dim mb-5">
              Silakan lakukan pembayaran dan hubungi kami via Instagram{" "}
              <strong className="text-cream">@aterictarot</strong> untuk konfirmasi. Pengerjaan maks 12 jam.
            </p>
            <button onClick={() => setResult(null)} className="bg-transparent border border-gold/50 text-gold font-serif text-base tracking-widest px-8 py-2.5 rounded-sm hover:bg-cream-faint transition">Tutup ✦</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-8">
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto mb-4">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <span className="text-[0.55rem] tracking-[0.5em] text-gold">✦ ✦ ✦</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </div>
        <p className="font-serif text-lg font-light tracking-[0.2em] uppercase text-cream">Ateric Tarot</p>
        <p className="text-xs tracking-[0.2em] text-gold mt-1">astral · intuitive · reflective</p>
        <p className="text-[0.6rem] tracking-widest text-cream/25 mt-4">© 2026 Ateric Tarot. All rights reserved. by @exceltrider</p>
      </footer>
    </div>
  );
}