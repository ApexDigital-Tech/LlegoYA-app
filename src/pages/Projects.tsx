import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Calendar, ChevronRight, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Projects = () => {
    const navigate = useNavigate();
    const { user } = useAppStore();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) setProjects(data);
            setIsLoading(false);
        };

        fetchProjects();
    }, [user, navigate]);

    const filteredProjects = projects.filter(p => 
        p.business_idea.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Mis Negocios</h1>
                    <p className="text-slate-400">Gestiona y consulta tus planes estratégicos.</p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all"
                >
                    <Plus size={20} /> Nuevo Plan
                </button>
            </header>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por idea de negocio..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl">
                    <Briefcase size={48} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-500">No tienes proyectos creados aún.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate(`/dashboard/${project.id}`)}
                            className="group flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-indigo-500/50 cursor-pointer transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-600/10 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-indigo-300 transition-colors">{project.business_idea}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(project.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{project.location}</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
