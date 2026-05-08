import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, Download, RefreshCw } from 'lucide-react';
import { generateStepContent } from '../lib/gemini';
import { useAppStore } from '../lib/store';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const StepDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { steps, updateStepStatus, updateStepContent, businessIdea, location } = useAppStore();
    const step = steps.find(s => s.id === id);

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!step) navigate('/dashboard');
    }, [step, navigate]);

    if (!step) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        updateStepStatus(step.id, 'generating');

        try {
            const content = await generateStepContent(step.id, step.title, businessIdea, location);
            const mockImage = step.id === 'brand-kit' ? 'https://via.placeholder.com/800x600/312e81/ffffff?text=Brand+Mockup' : undefined;

            await updateStepContent(step.id, content, mockImage);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Error generando contenido. Verifica tu API Key de Gemini en el archivo .env');
            updateStepStatus(step.id, 'pending');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = async () => {
        const element = document.getElementById('export-content');
        if (!element) return;

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${step.id}-plan.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </button>

            <header className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{step.title}</h1>
                    <p className="text-slate-400">{step.description}</p>
                </div>

                <div className="flex gap-3">
                    {step.status === 'completed' && (
                        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                            <Download size={18} /> Export PDF
                        </button>
                    )}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                        {step.status === 'completed' ? 'Regenerate' : 'Generate with AI'}
                    </button>
                </div>
            </header>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 min-h-[400px]">
                {isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                        <Wand2 size={48} className="text-indigo-500 animate-pulse mb-4" />
                        <p className="text-lg">Analyzing market data for {location}...</p>
                        <p className="text-sm opacity-50">Crafting your {step.title.toLowerCase()}...</p>
                    </div>
                ) : step.content ? (
                    <div id="export-content" className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: step.content }} />
                        {step.image && (
                            <div className="mt-8">
                                <img src={step.image} alt="Brand Mockup" className="rounded-xl shadow-2xl border border-slate-700 w-full" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                        <Wand2 size={48} className="mb-4 opacity-20" />
                        <p>Click "Generate with AI" to create this section.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

