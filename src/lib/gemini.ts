import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateStepContent = async (stepId: string, stepTitle: string, idea: string, location: string) => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompts: Record<string, string> = {
    "executive-summary": `Genera un Resumen Ejecutivo profesional para un negocio de "${idea}" en "${location}". Incluye: Misión, Visión y Factores de Éxito. Formato HTML usando clases de Tailwind (text-white, text-indigo-400, etc.).`,
    "market-research": `Genera un Análisis de Mercado para "${idea}" en "${location}". Incluye: Tamaño del mercado, Tendencias locales y Competencia. Formato HTML con clases de Tailwind.`,
    "target-audience": `Define el Buyer Persona y Público Objetivo para "${idea}" en "${location}". Incluye demografía y psicografía. Formato HTML con clases de Tailwind.`,
    "marketing-plan": `Genera un Plan de Marketing Estratégico para "${idea}" en "${location}". Incluye: Canales, Estrategia de lanzamiento y Presupuesto estimado. Formato HTML con clases de Tailwind.`,
    "financial-plan": `Genera una Proyección Financiera básica para "${idea}" en "${location}". Incluye: Fuentes de ingreso y Estructura de costos. Formato HTML con clases de Tailwind.`,
    "brand-kit": `Genera una Guía de Identidad de Marca para "${idea}". Incluye: Nombre sugerido, Eslogan, Paleta de colores (en formato hexadecimal) y Tono de comunicación. Formato HTML con clases de Tailwind.`,
  };

  const prompt = prompts[stepId] || `Genera una sección detallada de "${stepTitle}" para el plan de negocio de "${idea}" en "${location}". Formato HTML con clases de Tailwind.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Limpiar posibles bloques de código markdown del output
  text = text.replace(/```html/g, "").replace(/```/g, "");
  
  return text;
};
