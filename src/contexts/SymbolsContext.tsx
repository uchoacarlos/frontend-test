
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SymbolsContextType {
  symbolsToWatch: string[];
  addSymbols: (newSymbols: string[]) => void;
  removeSymbol: (symbol: string) => void;
  clearSymbols: () => void;
}


const SymbolsContext = createContext<SymbolsContextType | undefined>(undefined);


export const SymbolsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [symbolsToWatch, setSymbolsToWatch] = useState<string[]>([]);


  const addSymbols = (newSymbols: string[]) => {
    setSymbolsToWatch((prevSymbols) => Array.from(new Set([...prevSymbols, ...newSymbols])));
  };


  const removeSymbol = (symbol: string) => {
    setSymbolsToWatch((prevSymbols) => prevSymbols.filter((s) => s !== symbol));
  };

  const clearSymbols = () => {
    setSymbolsToWatch([]);
  };

  return (
    <SymbolsContext.Provider value={{ symbolsToWatch, addSymbols, removeSymbol, clearSymbols }}>
      {children}
    </SymbolsContext.Provider>
  );
};


export const useSymbols = (): SymbolsContextType => {
  const context = useContext(SymbolsContext);
  if (!context) {
    throw new Error("useSymbols deve ser usado dentro de um SymbolsProvider");
  }
  return context;
};
