import { createContext, useContext, useState, useMemo } from "react";
type MarketContextType = {
  selectedMarketId: number | null;
  setSelectedMarketId: (id: number | null) => void;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: any }) {
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null); //this is the bucket content

  // useMemo is used to ensure the provided object identity only changes when selectedMarketId changes
  // which limits re-renders of consuming components
  const value = useMemo(
    () => ({ selectedMarketId, setSelectedMarketId }),
    [selectedMarketId]
  );
  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
}

export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  // throw an error if useMarket is used outside of MarketProvider
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
};
