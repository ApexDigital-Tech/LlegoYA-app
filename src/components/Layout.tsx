import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, LogIn } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { businessIdea, user, signOut } = useAppStore();
    const location = useLocation();

    if (location.pathname === '/') {
        return (
            <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
                <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
                    <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        LlegoYA
                    </div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400">{user.email}</span>
                            <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm">
                                <LogOut size={16} /> Salir
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm">
                            <LogIn size={16} /> Entrar
                        </Link>
                    )}
                </nav>
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex selection:bg-indigo-500 selection:text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        <LayoutDashboard className="text-indigo-400" />
                        PlanGenius
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/projects" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/projects' ? 'bg-indigo-600/20 text-indigo-300' : 'hover:bg-slate-800 text-slate-400'}`}>
                        <LayoutDashboard size={20} />
                        <span>Mis Proyectos</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                            <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{user?.email?.split('@')[0]}</div>
                            <button onClick={() => signOut()} className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1">
                                <LogOut size={12} /> Salir
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Proyecto Actual</div>
                    <div className="text-sm text-slate-300 truncate">{businessIdea || 'Sin proyecto'}</div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
};
