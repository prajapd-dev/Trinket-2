import axios from "axios";
import { API_BASE_URL } from "../../../type/type";
import { Text } from "react-native-paper";
import { Image, StyleSheet, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import CustomBoothCard from "./CustomBoothCard";
import AddBooth from "../../Buttons/AddBooth";
import { useMarket } from "../../Contexts/MarketContext";
import LavenderBackground from "../../LavenderBackground";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type ViewBoothsFromAPI = {
  uuid: number;
  name: string;
  number: number;
  market_id: number;
  user_id: number;
  latitude: number;
  longitude: number;
};

type ApiResponse = {
  booths: ViewBoothsFromAPI[];
  message: string;
};

export default function ViewBooths({ route, navigation }: any) {
  const { marketEndDate, marketName, marketStartDate } = route.params;
  const { selectedMarketId } = useMarket();
  const [booths, setBooths] = useState<ViewBoothsFromAPI[]>([]);

  const onPressAddBooth = () => {
    return navigation.navigate("AddBooth", navigation);
  };

  const fetchBooths = async () => {
    console.log("ViewBooths: Fetching booths from API...");
    const { data } = await axios.get<ApiResponse>(
      `${API_BASE_URL}/custom_booth/${selectedMarketId}/1`
    );
    console.log(
      "ViewBooths: all booth data that was fetched ",
      JSON.stringify(data)
    );
    data.booths.map((b) => {
      b.latitude = Number(b.latitude);
      b.longitude = Number(b.longitude);
      return b;
    });
    setBooths(data.booths);
  };

  const onPressEditBooth = (
    boothUuid: number,
    boothNumber: number,
    boothName: string,
    lat: number | null,
    lng: number | null
  ) => {
    console.log(
      "ViewBooths: navigating to EditCustomBooth for booth: ",
      boothUuid,
      boothNumber,
      boothName,
      lat,
      lng
    );
    return navigation.navigate("EditCustomBooth", {
      boothUuid,
      boothNameCurr: boothName,
      boothNumberCurr: boothNumber,
      boothLatCurr: lat,
      boothLngCurr: lng,
    });
  };

  const onPressDeleteBooth = (boothUuid: number) => {
    console.log("Delete booth pressed for booth UUID: ", boothUuid);
    // Implement delete functionality here
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooths(); // re-fetch whenever you navigate back here
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Only render LavenderBackground if there are markets */}
        {booths.length > 0 && <LavenderBackground />}
        <AddBooth onPressAddBooth={onPressAddBooth} />
        <View style={styles.row}>
          <Text style={styles.boothName}>{marketName}</Text>

          <Text style={styles.dateRange}>
            {marketStartDate.toDateString()} - {marketEndDate.toDateString()}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            booths.length === 0 && styles.scrollEmptyContainer,
          ]}
        >
          {
            /* Render booth cards here when data is fetched */
            booths.length > 0 ? (
              booths.map((booth) => (
                <View key={booth.uuid} style={styles.verticallySpaced}>
                  <CustomBoothCard
                    key={booth.uuid}
                    name={booth.name}
                    number={booth.number}
                    lat={booth.latitude}
                    lng={booth.longitude}
                    onEditPress={() =>
                      onPressEditBooth(
                        booth.uuid,
                        booth.number,
                        booth.name,
                        booth.latitude,
                        booth.longitude
                      )
                    }
                    onDeletePress={() => onPressDeleteBooth(booth.uuid)}
                  />
                </View>
              ))
            ) : (
              <>
                <Image
                  style={styles.emptyImage}
                  source={require("../../../assets/booth.png")}
                />
                <Text style={styles.boothEmptyText}>No Markets</Text>
                <Text style={styles.boothEmptyBodyText}>
                  You haven't added any booths yet.
                </Text>
              </>
            )
          }
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // pushes title left, dates right
    alignItems: "center", // vertically centers them
  },
  boothName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#4B0082",
  },
  dateRange: {
    fontSize: 14,
    color: "#555",
  },
  safeArea: {
    flex: 1,
    padding: 10,
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
  boothEmptyText: {
    fontSize: 30,
    fontFamily: "Verdana",
    fontWeight: "bold",
    textAlign: "center",
  },
  boothEmptyBodyText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Verdana",
    color: "#808080",
    textAlign: "center",
    marginTop: 10,
  },
});
