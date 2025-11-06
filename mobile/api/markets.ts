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

  return data.markets
    .map((m) => ({
      ...m,
      startdate: new Date(m.startdate),
      enddate: new Date(m.enddate),
    }))
    .sort((a, b) => a.startdate.getTime() - b.startdate.getTime());
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
  formData.append("name", market.name);
  formData.append("startdate", market.startdate.toISOString());
  formData.append("enddate", market.enddate.toISOString());
  formData.append("img_url", market.img_url ? market.img_url : "");
  return axios.post(`${API_BASE_URL}/custom_market/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMarket = async (
  user_id: number,
  market_uuid: number,
  market: Partial<MarketDataPost>,
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

  for (const key in market) {
    const value = market[key as keyof Partial<MarketDataPost>];
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value) {
      formData.append(key, value);
    } else {
      // undefined behaviour .. should never reach here
    }
  }
  return axios.patch(
    `${API_BASE_URL}/custom_market/${market_uuid}/${user_id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
