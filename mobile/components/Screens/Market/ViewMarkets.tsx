import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import MarketCard from "./MarketCard";
import AddMarket from "../../Buttons/AddMarket";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useMarket } from "../../Contexts/MarketContext";
import {
  MarketDataGet,
  MarketDataCurr,
  MarketDataSendToBooth,
} from "./types";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import LavenderBackground from "../../LavenderBackground";
import { getMarkets } from "../../../api/markets";

export default function ViewMarkets({ navigation }: { navigation: any }) {
  const { setSelectedMarketUuid: setSelectedMarketId } = useMarket();
  const [markets, setMarkets] = useState<MarketDataGet[]>([]);
  
  const onPressAddMarket = () => {
    navigation.navigate("AddMarketScreen", navigation);
  };

  const onPressEditMarket = (market: MarketDataGet) => {
    const sendToEditScreenData: MarketDataCurr = {
      endDateCurr: market.enddate,
      imgUriCurr: market.img_url,
      marketUuid: market.uuid,
      marketNameCurr: market.name,
      startDateCurr: market.startdate,
    };
    navigation.navigate("EditMarketScreen", sendToEditScreenData);
  };

  const navigateToMarketDetails = (
    market_uuid: string,
    market: MarketDataSendToBooth
  ) => {
    setSelectedMarketId(market_uuid);
    navigation.navigate("MainTabs", {
      screen: "View Booths",
      params: {
        marketEndDate: market.marketEndDate,
        marketName: market.marketName,
        marketStartDate: market.marketStartDate,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        // will need to update with user_id once we get there
        const fetched: MarketDataGet[] = await getMarkets("123e4567-e89b-12d3-a456-426655440000"); 
        setMarkets(fetched)
        console.log("ViewMarkets: fetched markets:", fetched)
      })()
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Only render LavenderBackground if there are markets */}
        {markets.length > 0 && <LavenderBackground />}
        <AddMarket onPressAddMarket={onPressAddMarket} />
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            markets.length === 0 && styles.scrollEmptyContainer,
          ]}
        >
          {markets.length > 0 ? (
            markets.map((m) => (
              <MarketCard
                key={m.uuid}
                name={m.name}
                image={m.img_url}
                startDate={m.startdate}
                endDate={m.enddate}
                onPress={() =>
                  navigateToMarketDetails(m.uuid, {
                    marketEndDate: m.enddate,
                    marketName: m.name,
                    marketStartDate: m.startdate,
                  })
                }
                onEditPress={() => onPressEditMarket(m)}
              />
            ))
          ) : (
            <>
              <Image
                style={styles.emptyImage}
                source={require("../../../assets/market-stall.png")}
              />
              <Text style={styles.marketEmptyText}>No Markets</Text>
              <Text style={styles.marketEmptyBodyText}>
                You haven't added any markets yet.
              </Text>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 12,
  },
  scrollEmptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  emptyImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  marketEmptyText: {
    fontSize: 30,
    fontFamily: "Verdana",
    fontWeight: "bold",
    textAlign: "center",
  },
  marketEmptyBodyText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Verdana",
    color: "#808080",
    textAlign: "center",
    marginTop: 10,
  },
});
