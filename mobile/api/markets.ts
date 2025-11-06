import axios from "axios";
import {
  APIResponseGetMarket,
  MarketDataGet,
  MarketDataPost,
} from "../components/Screens/Market/types";
import { API_BASE_URL } from "../type/type";

export const getMarkets = async (userId: number): Promise<MarketDataGet[]> => {
  const { data } = await axios.get<APIResponseGetMarket>(
    `${API_BASE_URL}/custom_market/${userId}`
  );

  if (!data.success) throw new Error("getMarkets: failed to fetch markets");

  return data.markets.map((m) => ({
    ...m, 
    startdate: new Date(m.startdate),
    enddate: new Date(m.enddate)
  })).sort((a, b) => a.startdate.getTime() - b.startdate.getTime());
};

export const createMarket = async (
  user_id: number,
  market: MarketDataPost,
  imgData: any | null
) => {
  const formData = new FormData();
  if (imgData != null) {
    const file = {
      uri: imgData.assets[0].uri,
      type: imgData.assets[0].mimeType,
      name: imgData.assets[0].fileName,
    };
    formData.append("image", file as any);
  }
  formData.append("marketName", market.name);
  formData.append("startDate", market.startDate.toISOString());
  formData.append("endDate", market.endDate.toISOString());
  formData.append("img_uri", market.imgUri ? market.imgUri : "");
  return axios.post(`${API_BASE_URL}/custom_market/${user_id}`, formData, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
  });
};
