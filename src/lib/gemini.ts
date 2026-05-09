import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateStepContent(stepTitle: string, idea: string, location: string) {
  // Forzamos la versión 'v1' de la API que es la más estable
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
  }, { apiVersion: "v1" });

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
    // Si falla el modelo 1.5, intentamos con el pro 1.0 como respaldo
    try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" }, { apiVersion: "v1" });
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        return "Error de conexión con la IA. Por favor, verifica tu API Key en el archivo .env o espera unos minutos.";
    }
  }
}
