import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import MarketCard from "./MarketCard";
import AddMarket from "../../Buttons/AddMarket";
import axios from "axios";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../../type";
import { useMarket } from "../../Contexts/MarketContext";
import {
  MarketData,
  APIResponseGetMarket,
  MarketDataCurr,
  MarketDataSendToBooth,
} from "./types";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import LavenderBackground from "../../LavenderBackground";

export default function ViewMarkets({ navigation }: { navigation: any }) {
  const { setSelectedMarketId } = useMarket();
  const [markets, setMarkets] = useState<MarketData[]>([]);

  const fetchMarkets = async () => {
    const { data } = await axios.get<APIResponseGetMarket>(
      `${API_BASE_URL}/custom_market/1`
    );

    if (data.success) {
      const transformed: MarketData[] = data.markets.map((m) => ({
        ...m,
        startdate: new Date(m.startdate),
        enddate: new Date(m.enddate),
      }));

      transformed.sort((a, b) => a.startdate.getTime() - b.startdate.getTime());
      setMarkets(transformed);
      console.log(
        "MarketList: all market data that was fetched",
        JSON.stringify(data)
      );
    }
  };

  const onPressAddMarket = () => {
    navigation.navigate("AddMarketScreen", navigation);
  };

  const onPressEditMarket = (market: MarketData) => {
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
    marketId: number,
    market: MarketDataSendToBooth
  ) => {
    setSelectedMarketId(marketId);
    console.log(
      "marketEndDate: ",
      market.marketEndDate,
      "marketID: ",
      marketId,
      "marketName: ",
      market.marketName,
      "marketStartDate: ",
      market.marketStartDate
    );
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
      fetchMarkets();
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
