import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles } from 'lucide-react';

interface AIGeneratorProps {
  onTextGenerated: (text: string) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onTextGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateText = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("La clave API de Gemini no está configurada. Por favor, asegúrate de establecer la variable de entorno VITE_GEMINI_API_KEY en la configuración de tu sitio de despliegue (ej. Netlify, Vercel).");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Escribe un tweet corto e ingenioso sobre la creación de imágenes para redes sociales.",
      });

      if (response.text) {
        onTextGenerated(response.text);
      } else {
        throw new Error("No se generó texto.");
      }
    } catch (err) {
      console.error("Error al generar texto con IA:", err);
      let errorMessage = "No se pudo generar el texto. Por favor, inténtalo de nuevo.";
      if (err instanceof Error) {
          errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 mb-4">
      <button
        onClick={handleGenerateText}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500 dark:disabled:bg-gray-700 transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generar con IA
          </> 
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default AIGenerator;