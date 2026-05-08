import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateStepContent(stepTitle: string, idea: string, location: string) {
  // Usamos el modelo pro que es más estable para estas peticiones
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    Actúa como un consultor experto en negocios. Genera una sección detallada para un plan de negocios.
    SECCIÓN: ${stepTitle}
    IDEA DE NEGOCIO: ${idea}
    UBICACIÓN: ${location}
    
    INSTRUCCIONES:
    1. Escribe en ESPAÑOL profesional.
    2. Usa formato HTML (usa etiquetas <h3>, <p>, <ul>, <li>).
    3. Sé específico, creativo y realista.
    4. Proporciona datos y estrategias accionables.
    
    No incluyas introducciones innecesarias, ve directo al contenido.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error al generar contenido. Por favor, intenta de nuevo.";
  }
}
