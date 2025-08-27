"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
