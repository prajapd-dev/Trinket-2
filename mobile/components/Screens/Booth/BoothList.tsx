import axios from "axios";
import { API_BASE_URL } from "../../type";
import { Button } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import CustomBoothCard from "./CustomBoothCard";
import AddBooth from "../../Buttons/AddBooth";
import { useMarket } from "../../Contexts/MarketContext";

type BoothListFromAPI = {
  uuid: number;
  name: string;
  number: number;
  market_id: number;
  user_id: number;
  latitude: number;
  longitude: number;
};

type ApiResponse = {
  booths: BoothListFromAPI[];
  message: string;
};

export default function BoothList({ navigation }: { navigation: any }) {
    const { selectedMarketId } = useMarket();
  const [booths, setBooths] = useState<BoothListFromAPI[]>([]);

  const onPressAddBooth = () => {
    return navigation.navigate("AddBooth", navigation);
  };

  const fetchBooths = async () => {
    console.log("BoothList: Fetching booths from API...");
    const { data } = await axios.get<ApiResponse>(
      `${API_BASE_URL}/custom_booth/${selectedMarketId}/1`
    );
    console.log(
      "BoothList: all booth data that was fetched ",
      JSON.stringify(data)
    );
    data.booths.map((b) => {
      b.latitude = Number(b.latitude);
      b.longitude = Number(b.longitude);
      return b;
    });
    setBooths(data.booths);
  };

  const onPressEditBooth = (boothUuid: number, boothNumber: number, boothName: string, lat: number | null, lng: number | null) => {
    console.log("Navigating to EditCustomBooth for booth: ", boothUuid, boothNumber, boothName, lat, lng);
    return navigation.navigate("EditCustomBooth", { boothUuid, boothNameCurr: boothName, boothNumberCurr: boothNumber, boothLatCurr: lat, boothLngCurr: lng });
  }

  const onPressDeleteBooth = (boothUuid: number) => {
    console.log("Delete booth pressed for booth UUID: ", boothUuid);
    // Implement delete functionality here
  }
  
  useFocusEffect(
    useCallback(() => {
      fetchBooths(); // re-fetch whenever you navigate back here
    }, [])
  );

  return (
    <View style={styles.container}>
      <AddBooth onPressAddBooth={onPressAddBooth} />
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
                onEditPress={() => onPressEditBooth(booth.uuid, booth.number, booth.name, booth.latitude, booth.longitude)}
                onDeletePress={() => onPressDeleteBooth(booth.uuid)}
              />
            </View>
          ))
        ) : (
          <Text>No Booths Found</Text>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
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
