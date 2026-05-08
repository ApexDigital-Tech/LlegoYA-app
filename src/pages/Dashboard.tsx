import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Loader2, Home as HomeIcon } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { projectId: urlProjectId } = useParams();
    const { steps, businessIdea, location, loadProject, isLoading, projectId } = useAppStore();

    useEffect(() => {
        if (urlProjectId && urlProjectId !== projectId) {
            loadProject(urlProjectId);
        }
    }, [urlProjectId, projectId, loadProject]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
                <p className="text-xl">Cargando tu plan de negocio...</p>
            </div>
        );
    }

    if (!projectId && !urlProjectId) {
        return (
            <div className="text-center py-20">
                <HomeIcon size={48} className="mx-auto mb-4 text-slate-600" />
                <h2 className="text-2xl font-bold mb-4">No se encontró el proyecto</h2>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-indigo-600 rounded-lg">
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold mb-2">Your Business Roadmap</h1>
                <p className="text-slate-400">
                    Transforming <span className="text-indigo-400">"{businessIdea}"</span> in <span className="text-cyan-400">{location}</span> into reality.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(`/step/${step.id}`)}
                        className={`
              relative p-6 rounded-2xl border cursor-pointer group transition-all
              ${step.status === 'completed'
                                ? 'bg-slate-900/50 border-indigo-500/30 hover:border-indigo-500/60'
                                : 'bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}
            `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`
                p-3 rounded-xl 
                ${step.status === 'completed' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}
              `}>
                                {step.status === 'completed' ? <CheckCircle2 size={24} /> :
                                    step.status === 'generating' ? <Loader2 size={24} className="animate-spin" /> :
                                        <Circle size={24} />}
                            </div>
                            <span className="text-xs font-mono text-slate-500">STEP {index + 1}</span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">{step.title}</h3>
                        <p className="text-sm text-slate-400 mb-6 line-clamp-2">{step.description}</p>

                        <div className="flex items-center text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                            {step.status === 'completed' ? 'View Details' : 'Start Section'} <ArrowRight size={16} className="ml-1" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
