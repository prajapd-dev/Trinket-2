import { StyleSheet, View, Text } from "react-native";
import MarketCard from "../MarketCard";
import AddMarket from "../Buttons/AddMarket";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

type MarketFromAPI = {
  uuid: number;
  name: string;
  startdate: Date;
  enddate: Date;
  img_name: string;
  img_url: string | null;
  user_id: number;
};

type ApiResponse = {
  markets: MarketFromAPI[];
  message: string;
};


export default function MarketList({ navigation }: { navigation: any }) {
  const [markets, setMarkets] = useState<MarketFromAPI[]>([]);
  function onPressAddMarket() {
    return navigation.navigate("AddMarketScreen", navigation);
  }

  function onPressEditMarket(market: MarketFromAPI) {
    return navigation.navigate("EditMarketScreen", {
      marketUUID: market.uuid,
      marketNameCurr: market.name,
      startDateCurr: market.startdate,
      endDateCurr: market.enddate,
      imgUriCurr: market.img_url,
    });
  }
  const fetchMarkets = async () => {
    const { data } = await axios.get<ApiResponse>(
      "http://10.0.0.183:3000/api/marketEvent/1"
    );
    const transformed: MarketFromAPI[] = data.markets.map((m) => ({
      ...m,
      startdate: new Date(m.startdate),
      enddate: new Date(m.enddate),
    }));

    
    setMarkets(transformed);
    console.log("MarketList: all market data that was fetched ", JSON.stringify(data))
  };

  useFocusEffect(
    useCallback(() => {
      fetchMarkets(); // re-fetch whenever you navigate back here
    }, [])
  );
  return (
    <View style={styles.container}>
      <AddMarket onPressAddMarket={onPressAddMarket} />
      {markets && markets.length > 0 ? markets.map((m) => (
        <MarketCard 
        key={m.uuid}
        name={m.name}
        image={m.img_url}
        startDate={m.startdate}
        endDate={m.enddate}
        onPress={() => navigation.navigate("MainTabs", { screen: "Account" })}
        onEditPress={() => onPressEditMarket(m)}
        />
      )): <Text> No Markets Found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
