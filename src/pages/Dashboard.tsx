import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Loader2, Home as HomeIcon } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const Dashboard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { steps, fetchProject, isLoading, businessIdea } = useAppStore();

    useEffect(() => {
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId, fetchProject]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <p className="text-slate-400 animate-pulse">Cargando tu plan...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-12">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">
                    <HomeIcon size={16} />
                    <span>Panel de Control</span>
                </div>
                <h1 className="text-4xl font-black mb-4">{businessIdea || 'Tu Plan de Negocios'}</h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Hemos dividido tu estrategia en pasos clave. Completa cada sección para generar tu plan final.
                </p>
            </header>

            <div className="space-y-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(`/step/${step.id}`)}
                        className="group relative flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-3xl cursor-pointer hover:border-indigo-500/50 transition-all overflow-hidden"
                    >
                        <div className="flex items-center gap-6">
                            <div className="relative z-10">
                                {step.status === 'completed' ? (
                                    <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                                        <CheckCircle2 size={24} />
                                    </div>
                                ) : step.status === 'generating' ? (
                                    <div className="bg-indigo-500/20 p-2 rounded-full text-indigo-400">
                                        <Loader2 className="animate-spin" size={24} />
                                    </div>
                                ) : (
                                    <div className="text-slate-700">
                                        <Circle size={24} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-indigo-300 transition-colors">{step.title}</h3>
                                <p className="text-slate-500 mt-1">{step.description}</p>
                            </div>
                        </div>
                        <ArrowRight className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                        
                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/10 w-full" />
                        {step.status === 'completed' && (
                            <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
