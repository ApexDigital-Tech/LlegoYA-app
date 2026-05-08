import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Lightbulb } from 'lucide-react';
import { useAppStore } from '../lib/store';

export const Home = () => {
    const navigate = useNavigate();
    const { initProject, isLoading, user } = useAppStore();
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
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 max-w-3xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 mb-8 backdrop-blur-sm">
                        <Sparkles size={16} className="text-amber-400" />
                        <span className="text-sm text-slate-300">AI-Powered Business Planner</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                        Turn your idea into a <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Business Empire</span>
                    </h1>

                    <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Describe your vision and target location. Our AI will generate a comprehensive, investor-ready business plan including market analysis, financial projections, and brand identity.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl shadow-indigo-500/10"
                >
                    <div className="space-y-6 text-left">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                <Lightbulb size={16} />
                                What is your business idea?
                            </label>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="e.g., A specialty coffee shop that serves organic, locally sourced pastries..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none h-32"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                <MapPin size={16} />
                                Where will it be located?
                            </label>
                            <input
                                type="text"
                                value={loc}
                                onChange={(e) => setLoc(e.target.value)}
                                placeholder="e.g., Bogotá, Colombia"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={!idea || !loc}
                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            Start Building Plan
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
