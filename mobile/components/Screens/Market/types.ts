export interface MarketData {
  enddate: Date;
  img_name: string;
  img_url: string;
  name: string;
  startdate: Date;
  user_id: number;
  uuid: number;
}

export interface APIResponseGetMarket {
  markets: MarketData[];
  message: string;
  success: boolean;
}

export interface MarketDataCurr {
  imgUriCurr: string;
  marketNameCurr: string;
  marketUuid: number;
  startDateCurr: Date;
  endDateCurr: Date;
}

export interface MarketDataSendToBooth {
  marketEndDate: Date, 
  marketName: string, 
  marketStartDate: Date
}