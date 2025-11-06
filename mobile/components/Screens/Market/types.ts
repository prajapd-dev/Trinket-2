export interface MarketDataGet {
  enddate: Date;
  img_name: string;
  img_url: string;
  name: string;
  startdate: Date;
  user_id: number;
  uuid: number;
}

export interface APIResponseGetMarket {
  markets: MarketDataGet[];
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

export interface MarketDataPost {
  name: string;
  startDate: Date;
  endDate: Date;
  imgUri?: string; 
}