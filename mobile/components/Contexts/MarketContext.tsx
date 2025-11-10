import { createContext, useContext, useState, useMemo } from "react";
type MarketContextType = {
  selectedMarketUuid: string | null;
  setSelectedMarketUuid: (id: string | null) => void;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: any }) {
  const [selectedMarketUuid, setSelectedMarketUuid] = useState<string | null>(null); //this is the bucket content

  // useMemo is used to ensure the provided object identity only changes when selectedMarketId changes
  // which limits re-renders of consuming components
  const value = useMemo(
    () => ({ selectedMarketUuid, setSelectedMarketUuid }),
    [selectedMarketUuid]
  );
  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
}

//this is how we access the bucket content
export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  // throw an error if useMarket is used outside of MarketProvider
  if (context === undefined) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
};
