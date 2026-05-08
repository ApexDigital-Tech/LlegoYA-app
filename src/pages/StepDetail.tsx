import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, Download, RefreshCw } from 'lucide-react';
import { generateStepContent } from '../lib/gemini';
import { useAppStore } from '../lib/store';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const StepDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { steps, updateStepStatus, businessIdea, location } = useAppStore();
    const step = steps.find(s => s.id === id);
    const [content, setContent] = useState(step?.content || '');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (step?.content) {
            setContent(step.content);
        }
    }, [step]);

    const handleGenerate = async () => {
        if (!step) return;
        setIsGenerating(true);
        updateStepStatus(step.id, 'generating');

        try {
            // Pasamos instrucciones en español para asegurar la salida en español
            const prompt = `Actúa como un consultor experto. Genera el contenido para la sección "${step.title}" de un plan de negocios para: "${businessIdea}" ubicado en "${location}". Instrucciones específicas: ${step.description}. Responde SOLO en formato HTML profesional y limpio (usando h2, p, ul, li). El idioma debe ser ESPAÑOL.`;
            const result = await generateStepContent(prompt);
            setContent(result);
            updateStepStatus(step.id, 'completed', result);
        } catch (error) {
            console.error(error);
            updateStepStatus(step.id, 'pending');
        } finally {
            setIsGenerating(false);
        }
    };

    const exportToPDF = async () => {
        const element = document.getElementById('step-content');
        if (!element) return;

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${step?.title || 'seccion'}.pdf`);
    };

    if (!step) return null;

    return (
        <div className="max-w-5xl mx-auto">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver al Panel
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[32px]">
                        <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            {step.description}
                        </p>
                        
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                                isGenerating 
                                ? 'bg-slate-800 text-slate-500' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02]'
                            }`}
                        >
                            {isGenerating ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <Wand2 size={20} />
                            )}
                            {isGenerating ? 'Generando...' : content ? 'Regenerar con IA' : 'Generar con IA'}
                        </button>

                        {content && (
                            <button
                                onClick={exportToPDF}
                                className="w-full mt-4 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                            >
                                <Download size={20} />
                                Exportar a PDF
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2">
                    <div className="min-h-[600px] bg-slate-900/30 border border-slate-800 rounded-[32px] p-10 relative">
                        {!content && !isGenerating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-12 text-center">
                                <Sparkles size={48} className="mb-4 opacity-20" />
                                <p className="text-lg">Haz clic en "Generar con IA" para crear esta sección de tu plan estratégico.</p>
                            </div>
                        ) : isGenerating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm rounded-[32px] z-10">
                                <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                                <p className="text-xl font-bold text-indigo-300 animate-pulse">Redactando contenido profesional...</p>
                                <p className="text-slate-500 text-sm mt-2">Esto puede tardar unos segundos</p>
                            </div>
                        ) : null}

                        <div 
                            id="step-content"
                            className="prose prose-invert prose-indigo max-w-none prose-headings:font-black prose-p:text-slate-300 prose-li:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
