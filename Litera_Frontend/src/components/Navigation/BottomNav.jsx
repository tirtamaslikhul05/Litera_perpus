// src/components/Navigation/BottomNav.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
    { label: 'Beranda', icon: '🏠', path: '/dashboard' },
    { label: 'Cari', icon: '🔍', path: '/catalog/search' },
    { label: 'Rak', icon: '📖', path: '/bookshelf' },
    { label: 'Denda', icon: '💰', path: '/fines/fines-status' },
    { label: 'Profil', icon: '👤', path: '/profile' },
];

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (tabPath) => {
        if (tabPath === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(tabPath);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2.5 px-4 flex items-center justify-around z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            {tabs.map((tab) => (
                <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive(tab.path)
                            ? 'text-[#0c3966]'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    {isActive(tab.path) ? (
                        <div className="px-4 py-1 bg-blue-50 rounded-full">{tab.icon}</div>
                    ) : (
                        <span className="text-lg">{tab.icon}</span>
                    )}
                    <span className={`text-[10px] ${isActive(tab.path) ? 'font-bold' : ''}`}>
                        {tab.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
