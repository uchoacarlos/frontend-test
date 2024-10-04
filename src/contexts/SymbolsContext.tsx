// src/contexts/SymbolsContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o tipo para os dados do contexto
interface SymbolsContextType {
  symbolsToWatch: string[];
  addSymbols: (newSymbols: string[]) => void;
  removeSymbol: (symbol: string) => void;
  clearSymbols: () => void;
}

// Cria o contexto com valores padrão
const SymbolsContext = createContext<SymbolsContextType | undefined>(undefined);

// Componente Provider que envolve a aplicação e fornece o contexto
export const SymbolsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [symbolsToWatch, setSymbolsToWatch] = useState<string[]>([]);

  // Função para adicionar novos símbolos, evitando duplicatas
  const addSymbols = (newSymbols: string[]) => {
    setSymbolsToWatch((prevSymbols) => Array.from(new Set([...prevSymbols, ...newSymbols])));
  };

  // Função para remover um símbolo específico
  const removeSymbol = (symbol: string) => {
    setSymbolsToWatch((prevSymbols) => prevSymbols.filter((s) => s !== symbol));
  };

  // Função para limpar todos os símbolos selecionados
  const clearSymbols = () => {
    setSymbolsToWatch([]);
  };

  return (
    <SymbolsContext.Provider value={{ symbolsToWatch, addSymbols, removeSymbol, clearSymbols }}>
      {children}
    </SymbolsContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente nos componentes
export const useSymbols = (): SymbolsContextType => {
  const context = useContext(SymbolsContext);
  if (!context) {
    throw new Error("useSymbols deve ser usado dentro de um SymbolsProvider");
  }
  return context;
};
