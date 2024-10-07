import { act, render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./components/SymbolSelector", () => () => <div>Mock SymbolSelector</div>);
jest.mock("./components/PriceList", () => () => <div>Mock PriceList</div>);

describe("App Component", () => {
  test("renderiza o título da aplicação", async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<App />);
    });

    const titleElement = screen.getByText(/Binance Pricing App/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("renderiza os componentes SymbolSelector e PriceList", () => {
    render(<App />);
    
    const symbolSelector = screen.getByText(/Mock SymbolSelector/i);
    const priceList = screen.getByText(/Mock PriceList/i);
    
    expect(symbolSelector).toBeInTheDocument();
    expect(priceList).toBeInTheDocument();
  });
});
