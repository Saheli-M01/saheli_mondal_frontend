"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ViewMode = "personal" | "recruiter";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("personal");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved === "recruiter" || saved === "personal") {
      setViewMode(saved);
    }
  }, []);

  // Save to localStorage when changed
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("viewMode", mode);
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode: handleSetViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
