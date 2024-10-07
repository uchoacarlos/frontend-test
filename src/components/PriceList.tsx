import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import useWebSocket from "../hooks/useWebSocket";
import { useSymbols } from "../contexts/SymbolsContext";
import DeleteIcon from "@mui/icons-material/Delete";

interface PriceData {
  symbol: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  priceChangePercent: string;
}

const formatPrice = (price: string) => {
  const num = parseFloat(price);
  return isNaN(num) ? "N/A" : num.toFixed(4);
};

const formatPercentage = (percent: string) => {
  const num = parseFloat(percent);
  return isNaN(num) ? "N/A" : `${num.toFixed(2)}%`;
};

const PriceList: React.FC = () => {
  const { symbolsToWatch, removeSymbol } = useSymbols();
  const [prices, setPrices] = useState<PriceData[]>([]);

  const onMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Data received from WebSocket:", data);

        if (data.stream && data.data) {
          const ticker = data.data;

          if (ticker.e === "24hrTicker") {
            setPrices((prev) => {

              if (!symbolsToWatch.includes(ticker.s.toUpperCase())) {
                return prev;
              }

              const index = prev.findIndex((price) => price.symbol === ticker.s);
              if (index >= 0) {
                const updatedPrices = [...prev];
                updatedPrices[index] = {
                  symbol: ticker.s,
                  lastPrice: ticker.c,
                  bidPrice: ticker.b,
                  askPrice: ticker.a,
                  priceChangePercent: ticker.P,
                };
                return updatedPrices;
              } else {
                return [
                  ...prev,
                  {
                    symbol: ticker.s,
                    lastPrice: ticker.c,
                    bidPrice: ticker.b,
                    askPrice: ticker.a,
                    priceChangePercent: ticker.P,
                  },
                ];
              }
            });
          }
        }
      } catch (error) {
        console.error("Erro ao processar dados do WebSocket:", error);
      }
    },
    [symbolsToWatch]
  );

  const symbolStreams = symbolsToWatch.map(
    (symbol) => `${symbol.toLowerCase()}@ticker`
  );
  const streamUrl = symbolsToWatch.length > 0
    ? `wss://stream.binance.com:9443/stream?streams=${symbolStreams.join("/")}`
    : "";

  useWebSocket(streamUrl, onMessage, {
    onError: (error) => console.error("WebSocket erro:", error),
    onClose: () => console.warn("WebSocket fechado."),
  });

  const handleRemoveSymbol = (symbol: string) => {

    removeSymbol(symbol);

    setPrices((prev) => prev.filter((price) => price.symbol !== symbol));
  };

  if (symbolsToWatch.length === 0) {
    return (
      <Typography
        variant="h6"
        align="center"
        sx={{ width: "100%", alignSelf: "center" }}
      >
        Nenhum símbolo selecionado para monitoramento.
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      style={{ margin: "10px", marginLeft: "5px", border: "1px solid #e0e0e0" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Last Price</TableCell>
            <TableCell>Bid Price</TableCell>
            <TableCell>Ask Price</TableCell>
            <TableCell>Price Change (%)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prices.length > 0 ? (
            prices.map((price) => (
              <TableRow key={price.symbol}>
                <TableCell>{price.symbol}</TableCell>
                <TableCell>{formatPrice(price.lastPrice)}</TableCell>
                <TableCell>{formatPrice(price.bidPrice)}</TableCell>
                <TableCell>{formatPrice(price.askPrice)}</TableCell>
                <TableCell>
                  {formatPercentage(price.priceChangePercent)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveSymbol(price.symbol)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No price data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceList;
