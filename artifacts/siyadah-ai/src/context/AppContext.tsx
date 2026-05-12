import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "@/lib/translations";

type Language = "en" | "ar";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("siyadah_language");
    return (saved === "ar" || saved === "en") ? saved : "en";
  });

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.documentElement.style.fontFamily = language === "ar" 
      ? "'IBM Plex Sans Arabic', sans-serif" 
      : "'Inter', sans-serif";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("siyadah_language", lang);
  };

  const t = (key: string): string => {
    const langMap = translations[language] as Record<string, string>;
    return langMap[key] ?? key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}