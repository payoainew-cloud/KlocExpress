import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getShoppingAdvice = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "Przepraszam, klucz API nie jest skonfigurowany. Nie mogę teraz udzielić porady.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: "Jesteś ekspertem i entuzjastą klocków LEGO pracującym w sklepie 'KlockiŚwiat'. Twój styl jest przyjazny, pełen energii i pomocny. Pomagasz klientom wybrać idealny zestaw LEGO na prezent lub dla siebie. Sugeruj konkretne serie (Star Wars, City, Technic) w oparciu o wiek i zainteresowania. Odpowiadaj krótko i konkretnie, używając emotikon klocków jeśli to możliwe. Mów po polsku.",
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for chat
      }
    });

    return response.text || "Przepraszam, mam chwilowe problemy z łącznością z bazą wiedzy LEGO.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Wystąpił błąd podczas generowania porady. Spróbuj ponownie później.";
  }
};
