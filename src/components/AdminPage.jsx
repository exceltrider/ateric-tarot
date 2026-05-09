import { useState, useEffect, useCallback } from 'react';

const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', done: 'Done' };

function formatRupiah(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}
function formatDate(d) {
  return new Date(d).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders.php');
      const data = await res.json();
      setOrders(data);
    } catch {
      setError('Gagal mengambil data. Pastikan server aktif.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatus = async (id, status) => {
    try {
      await fetch('/api/update-status.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {
      alert('Gagal update status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch('/api/delete-order.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch {
      alert('Gagal hapus pesanan.');
    } finally {
      setConfirmDelete(null);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      String(o.id).includes(q);
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    done: orders.filter((o) => o.status === 'done').length,
    revenue: orders.filter((o) => o.status !== 'pending').reduce((s, o) => s + Number(o.total_amount), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#150000] to-[#060000]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-crimson/30 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-cream">Ateric Tarot</h1>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gold mt-0.5">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchOrders} className="text-xs tracking-widest text-cream-dim border border-crimson/30 px-3 py-1.5 rounded-sm hover:border-gold/50 hover:text-gold transition">
              ↻ Refresh
            </button>
            <a href="/" className="text-xs tracking-widest text-cream-dim hover:text-gold transition">← Halaman Utama</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-crimson/10 border border-crimson/30 rounded-md p-4">
            <p className="text-[0.62rem] tracking-[0.15em] uppercase text-cream-dim">Total Pesanan</p>
            <p className="font-serif text-3xl font-light text-cream">{stats.total}</p>
          </div>
          <div className="bg-orange-900/10 border border-orange-700/30 rounded-md p-4">
            <p className="text-[0.62rem] tracking-[0.15em] uppercase text-cream-dim">Menunggu</p>
            <p className="font-serif text-3xl font-light text-cream">{stats.pending}</p>
          </div>
          <div className="bg-green-900/10 border border-green-700/30 rounded-md p-4">
            <p className="text-[0.62rem] tracking-[0.15em] uppercase text-cream-dim">Selesai</p>
            <p className="font-serif text-3xl font-light text-cream">{stats.done}</p>
          </div>
          <div className="bg-gold/10 border border-gold-dim rounded-md p-4">
            <p className="text-[0.62rem] tracking-[0.15em] uppercase text-cream-dim">Total Revenue</p>
            <p className="font-serif text-xl font-light text-cream">{formatRupiah(stats.revenue)}</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            className="flex-1 min-w-[200px] bg-cream-faint border border-crimson/30 rounded-sm text-cream font-mono text-sm p-2.5 outline-none focus:border-gold/50 placeholder:text-cream/30"
            placeholder="Cari nama, email, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-1.5">
            {['all', 'pending', 'confirmed', 'done'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm border transition ${
                  filterStatus === s
                    ? 'border-gold/50 text-gold bg-gold/10'
                    : 'border-crimson/30 text-cream-dim hover:border-gold/50 hover:text-gold'
                }`}
              >
                {s === 'all' ? 'Semua' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 text-xs p-3 rounded-sm mb-4">
            {error}
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-16 text-cream-dim">
            <span className="block text-3xl text-gold mb-4 animate-pulse">☽</span>
            <p>Memuat data pesanan…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-cream-dim">
            <span className="block text-2xl text-gold mb-2">✦</span>
            <p>Tidak ada pesanan ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-crimson/30 rounded-sm">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-crimson/20">
                <tr>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">ID</th>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">Client</th>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">Tanggal</th>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">Layanan</th>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">Total</th>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">Status</th>
                  <th className="text-left p-3 text-[0.6rem] tracking-[0.18em] uppercase text-gold font-normal">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className={`border-b border-crimson/20 hover:bg-crimson/10 ${order.status === 'done' ? 'bg-green-900/5' : ''}`}>
                    <td className="p-3 font-bold text-gold">#{order.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-cream">{order.customer_name}</p>
                      <p className="text-[0.65rem] text-cream-dim">{order.customer_email}</p>
                      {order.customer_instagram && <p className="text-[0.62rem] text-crimson-mid mt-0.5">{order.customer_instagram}</p>}
                    </td>
                    <td className="p-3 text-cream-dim whitespace-nowrap">{formatDate(order.order_date)}</td>
                    <td className="p-3">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="flex justify-between gap-3 py-0.5 border-b border-crimson/10 last:border-0">
                          <span className="text-cream-dim">{item.service_name}</span>
                          <span className="text-cream font-bold">{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-bold text-gold whitespace-nowrap">{formatRupiah(order.total_amount)}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatus(order.id, e.target.value)}
                        className={`text-xs bg-black/30 border rounded-sm px-2 py-1 outline-none cursor-pointer ${
                          order.status === 'pending' ? 'border-orange-500/50 text-orange-400' :
                          order.status === 'confirmed' ? 'border-blue-500/50 text-blue-400' :
                          'border-green-500/50 text-green-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setConfirmDelete(order.id)}
                        className="w-7 h-7 border border-red-500/40 text-red-400/70 rounded-sm flex items-center justify-center hover:bg-red-900/30 hover:border-red-500/60 hover:text-red-300 transition"
                        title="Hapus pesanan"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-right text-[0.62rem] tracking-widest text-cream-dim mt-3">
          Menampilkan {filtered.length} dari {orders.length} pesanan
        </p>
      </main>

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-gradient-to-b from-[#1f0000] to-[#0d0000] border border-red-500/40 rounded-md p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl text-red-400 mb-3">✕</p>
            <h3 className="font-serif text-2xl font-light mb-2">Hapus Pesanan #{confirmDelete}?</h3>
            <p className="text-xs text-cream-dim mb-5">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-transparent border border-crimson/30 text-cream-dim font-mono text-sm tracking-widest py-2.5 rounded-sm hover:border-gold/50 hover:text-gold transition">Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-crimson border border-red-500/40 text-cream font-mono text-sm tracking-widest py-2.5 rounded-sm hover:bg-crimson-mid transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}