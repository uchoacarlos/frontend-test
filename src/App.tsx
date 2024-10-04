// src/App.tsx
import React from "react";
import { Card, Container, Typography } from "@mui/material";
import SymbolSelector from "./components/SymbolSelector";
import PriceList from "./components/PriceList";
import { SymbolsProvider } from "./contexts/SymbolsContext";

const App: React.FC = () => {
  return (
    <SymbolsProvider>
      <Container>
        <Typography variant="h4" gutterBottom>
          Binance Pricing App
        </Typography>
        <Card sx={{display: "flex", flexDirection: "row", border: "1px solid #e0e0e0", borderRadius: 2, }}>
          <SymbolSelector />
          <PriceList />
        </Card>
      </Container>
    </SymbolsProvider>
  );
};

export default App;
