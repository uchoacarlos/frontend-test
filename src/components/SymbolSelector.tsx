import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Box,
} from "@mui/material";
import axios from "axios";
import { useSymbols } from "../contexts/SymbolsContext";

interface Symbol {
  symbol: string;
}

const SymbolSelector: React.FC = () => {
  const { addSymbols, clearSymbols } = useSymbols();
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/exchangeInfo"
        );
        setSymbols(response.data.symbols);
      } catch (err) {
        console.error("Erro ao buscar símbolos:", err);
        setError("Falha ao carregar os símbolos. Tente novamente mais tarde.");
      }
    };
    fetchSymbols();
  }, []);

  const handleSelect = (symbol: string) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleAddToList = () => {
    addSymbols(selectedSymbols);
    setSuccess(`${selectedSymbols.length} símbolo(s) adicionado(s) à lista.`);
  };

  const handleClearSelection = () => {
    setSelectedSymbols([]);
  };

  const filteredSymbols = symbols.filter((s) =>
    s.symbol.includes(search.toUpperCase())
  );

  return (
    <Box
      sx={{
        width: '30%',
        margin: "10px",
        marginRight: "5px",
        padding: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Stack spacing={2}>
        {/* Campo de Busca */}
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />

        {/* Lista de Símbolos Filtrados */}
        <Box
          sx={{
            maxHeight: 300,
            minHeight: "350px",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            padding: 1,
            backgroundColor: "#ffffff",
          }}
        >
          {search &&
            (filteredSymbols.length > 0 ? (
              <Stack spacing={1}>
                {filteredSymbols.map((symbol) => (
                  <FormControlLabel
                    key={symbol.symbol}
                    control={
                      <Checkbox
                        checked={selectedSymbols.includes(symbol.symbol)}
                        onChange={() => handleSelect(symbol.symbol)}
                      />
                    }
                    label={symbol.symbol}
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body1">No symbols found</Typography>
            ))}
        </Box>

        {/* Botões Empilhados Verticalmente */}
        <Stack spacing={1}>
          <Button
            variant="contained"
            onClick={handleAddToList}
            disabled={selectedSymbols.length === 0}
            fullWidth
          >
            Add to List
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearSelection}
            disabled={selectedSymbols.length === 0}
            fullWidth
          >
            Uncheck All Selected
          </Button>
        </Stack>
      </Stack>

      {/* Snackbars para Feedback */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SymbolSelector;
