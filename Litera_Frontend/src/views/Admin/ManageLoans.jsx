// src/views/Admin/ManageLoans.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BookMarked,
    Wallet,
    LogOut,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import AdminService from '../../core/services/AdminService';
import AuthService from '../../core/services/AuthService';

export default function ManageLoans() {
    const navigate = useNavigate();

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("pending"); // pending | approved | returned

    const fetchLoans = async (status = "pending") => {
        try {
            setLoading(true);
            setError("");

            const response = await AdminService.getAllLoans({ status });
            // response = { status: 'success', data: [...], meta: {...} }
            setLoans(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data peminjaman.");
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans(statusFilter);
    }, [statusFilter]);

    const handleApprove = async (loanId, namaBuku, namaSiswa) => {
        if (
            !window.confirm(
                `Setujui peminjaman buku "${namaBuku}" oleh ${namaSiswa}?`,
            )
        )
            return;

        try {
            await AdminService.approveLoan(loanId);
            alert("✅ Peminjaman berhasil disetujui!");
            fetchLoans(statusFilter);
        } catch (err) {
            alert(err?.response?.data?.message || "Gagal menyetujui peminjaman.");
        }
    };

    const handleReject = async (loanId) => {
        if (!window.confirm("Tolak peminjaman ini?")) return;

        try {
            await AdminService.rejectLoan(loanId);
            alert("✅ Peminjaman berhasil ditolak.");
            fetchLoans(statusFilter);
        } catch (err) {
            alert(err?.response?.data?.message || "Gagal menolak peminjaman.");
        }
    };

    const handleLogout = () => {
        if (window.confirm("Keluar dari sesi admin?")) {
            AuthService.logout();
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans flex text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-[#02244d] text-white flex flex-col justify-between shrink-0 shadow-xl">
                <div>
                    <div className="p-6 border-b border-white/5">
                        <h1 className="text-lg font-black tracking-wider">LITERA</h1>
                        <span className="text-xs text-slate-400">Admin Panel</span>
                    </div>

                    <nav className="p-4 space-y-1">
                        <button
                            onClick={() => navigate("/admin/dashboard")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/admin/books")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
                        >
                            <BookOpen className="w-4 h-4" />
                            Kelola Buku
                        </button>
                        <button
                            onClick={() => navigate("/admin/loans")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-[#2563eb] text-white transition-all text-left"
                        >
                            <Clock className="w-4 h-4" />
                            Peminjaman
                        </button>
                        <button
                            onClick={() => navigate("/admin/students")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
                        >
                            <Users className="w-4 h-4" />
                            Kelola Siswa
                        </button>
                        <button
                            onClick={() => navigate("/admin/returns")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
                        >
                            <BookMarked className="w-4 h-4" />
                            Pengembalian
                        </button>
                        <button
                            onClick={() => navigate("/admin/fines")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left"
                        >
                            <Wallet className="w-4 h-4" />
                            Denda
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-white/5 transition-all text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Manajemen Peminjaman
                    </h2>
                    <p className="text-sm text-slate-500">
                        Kelola peminjaman buku, persetujuan, dan riwayat
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "pending", label: "⏳ Menunggu", color: "bg-amber-100 text-amber-700" },
                        { key: "approved", label: "✅ Disetujui", color: "bg-emerald-100 text-emerald-700" },
                        { key: "returned", label: "📚 Dikembalikan", color: "bg-blue-100 text-blue-700" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatusFilter(tab.key)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${statusFilter === tab.key
                                    ? `${tab.color} ring-2 ring-offset-1`
                                    : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Memuat data peminjaman...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-12">{error}</div>
                ) : loans.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
                        <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-400">
                            {statusFilter === "pending"
                                ? "Tidak ada peminjaman yang menunggu persetujuan."
                                : statusFilter === "approved"
                                    ? "Tidak ada peminjaman yang sedang aktif."
                                    : "Belum ada riwayat pengembalian."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 text-xs text-slate-500 font-semibold border-b">
                                    <th className="p-5 text-left">Siswa</th>
                                    <th className="p-5 text-left">Buku</th>
                                    <th className="p-5 text-center">Tanggal Pinjam</th>
                                    <th className="p-5 text-center">Jatuh Tempo</th>
                                    <th className="p-5 text-center">Status</th>
                                    <th className="p-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-slate-50">
                                        <td className="p-5">
                                            <div className="font-medium text-sm">
                                                {loan.student?.name || loan.user?.name || "N/A"}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono">
                                                {loan.student?.nisn || loan.user?.nisn || ""}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm">
                                            {loan.book?.nama_buku || "N/A"}
                                            <div className="text-xs text-slate-400">
                                                ISBN: {loan.book?.isbn || "-"}
                                            </div>
                                        </td>
                                        <td className="p-5 text-center text-sm">
                                            {loan.tanggal_pinjam || (
                                                <span className="text-amber-500 text-xs">Belum disetujui</span>
                                            )}
                                        </td>
                                        <td className="p-5 text-center text-sm">
                                            {loan.tanggal_jatuh_tempo || "-"}
                                        </td>
                                        <td className="p-5 text-center">
                                            {loan.status === "pending" && (
                                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                                                    <Clock className="w-3 h-3" />
                                                    Menunggu
                                                </span>
                                            )}
                                            {loan.status === "approved" && (
                                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Disetujui
                                                </span>
                                            )}
                                            {loan.status === "returned" && (
                                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                    ✔️ Dikembalikan
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-center">
                                            {loan.status === "pending" && (
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                loan.id,
                                                                loan.book?.nama_buku,
                                                                loan.student?.name || loan.user?.name || "Siswa",
                                                            )
                                                        }
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition"
                                                    >
                                                        <CheckCircle className="w-3 h-3 inline mr-1" />
                                                        Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(loan.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold transition"
                                                    >
                                                        <XCircle className="w-3 h-3 inline mr-1" />
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}
                                            {loan.status === "approved" && (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                            {loan.status === "returned" && (
                                                <span className="text-xs text-slate-400">
                                                    {loan.tanggal_kembali || "—"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
