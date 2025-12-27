"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define available languages
type Language = "en" | "ru";

// Define translation structure
interface Translations {
  [key: string]: string;
}

// Russian translations with official construction terminology
const ruTranslations: Translations = {
  // General
  "New Project": "Новый проект",
  "Upload": "Загрузить",
  "Analyze": "Анализировать",
  "Generate": "Сформировать",
  "Create new project": "Создать новый проект",
  "Upload documents": "Загрузка проектной документации",
  "Analyze documents with AI": "Анализ документации с помощью ИИ",
  "Generate reports from templates": "Формирование отчетов по шаблонам",
  "Enter project name:": "Введите наименование проекта:",
  "Failed to create project. Please try again.": "Не удалось создать проект. Пожалуйста, попробуйте еще раз.",
  "Error creating project:": "Ошибка при создании проекта:",
  "No project loaded": "Проект не загружен",
  "Loading project...": "Загрузка проекта...",
  
  // Document statuses
  "uploaded": "Загружен",
  "processing": "Обработка",
  "completed": "Завершен",
  "error": "Ошибка",
  
  // UI elements
  "Documents": "Документы",
  "Projects": "Проекты",
  "Project": "Проект",
  "Section": "Раздел",
  "Folder": "Папка",
  "Document": "Документ",
  
  // Section types
  "КМ": "КМ - Металлические конструкции",
  "КЖ": "КЖ - Железобетонные конструкции",
  
  // Document types
  "design": "Проектная документация",
  "executive": "Исполнительная документация",
  
  // Toolbar actions
  "Create Project": "Создать проект",
  "Upload Documents": "Загрузить документы",
  "AI Analysis": "Анализ ИИ",
  "Report Generation": "Формирование отчетов",
  
  // Status badges
  "✓": "✓",
  "...": "...",
  "○": "○",
  "✗": "✗",
};

// English translations (default)
const enTranslations: Translations = {
  // General
  "New Project": "New Project",
  "Upload": "Upload",
  "Analyze": "Analyze",
  "Generate": "Generate",
  "Create new project": "Create new project",
  "Upload documents": "Upload documents",
  "Analyze documents with AI": "Analyze documents with AI",
  "Generate reports from templates": "Generate reports from templates",
  "Enter project name:": "Enter project name:",
  "Failed to create project. Please try again.": "Failed to create project. Please try again.",
  "Error creating project:": "Error creating project:",
  "No project loaded": "No project loaded",
  "Loading project...": "Loading project...",
  
  // Document statuses
  "uploaded": "Uploaded",
  "processing": "Processing",
  "completed": "Completed",
  "error": "Error",
  
  // UI elements
  "Documents": "Documents",
  "Projects": "Projects",
  "Project": "Project",
  "Section": "Section",
  "Folder": "Folder",
  "Document": "Document",
  
  // Section types
  "КМ": "КМ - Metal Structures",
  "КЖ": "КЖ - Reinforced Concrete",
  
  // Document types
  "design": "Design Documentation",
  "executive": "Executive Documentation",
  
  // Toolbar actions
  "Create Project": "Create Project",
  "Upload Documents": "Upload Documents",
  "AI Analysis": "AI Analysis",
  "Report Generation": "Report Generation",
  
  // Status badges
  "✓": "✓",
  "...": "...",
  "○": "○",
  "✗": "✗",
};

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check for saved language preference or default to 'en'
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'ru';
    }
    return 'ru'; // Default to Russian as requested
  });

  const t = (key: string): string => {
    const translations = language === 'ru' ? ruTranslations : enTranslations;
    return translations[key] || key; // Return the key itself if no translation found
  };

  const value: LocaleContextType = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    },
    t,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}