import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Lightbulb } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const Home = () => {
    const navigate = useNavigate();
    const { initProject, user } = useAppStore();
    const [idea, setIdea] = useState('');
    const [loc, setLoc] = useState('');

    const handleStart = async () => {
        if (!idea || !loc) return;
        if (!user) {
            navigate('/auth');
            return;
        }
        const id = await initProject(idea, loc);
        if (id) {
            navigate(`/dashboard/${id}`);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-4xl text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-indigo-400 text-sm font-medium mb-8">
                    <Sparkles size={16} />
                    <span>Planificador de Negocios con IA</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
                    Convierte tu idea en un <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Imperio Comercial
                    </span>
                </h1>

                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Describe tu visión y ubicación. Nuestra IA generará un plan de negocios completo, 
                    listo para inversores, incluyendo análisis de mercado y proyecciones financieras.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto bg-slate-900/50 p-6 rounded-[32px] border border-slate-800 backdrop-blur-xl">
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-slate-500">
                            <Lightbulb size={20} />
                        </div>
                        <textarea 
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="¿Cuál es tu idea de negocio? (ej: Cafetería orgánica)"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 h-32 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <MapPin size={20} />
                            </div>
                            <input 
                                type="text"
                                value={loc}
                                onChange={(e) => setLoc(e.target.value)}
                                placeholder="¿Dónde se ubicará?"
                                className="w-full h-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
                            />
                        </div>
                        <button 
                            onClick={handleStart}
                            className="h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 group"
                        >
                            Empezar ahora
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
