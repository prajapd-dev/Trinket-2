export interface MarketDataGet {
  enddate: Date;
  img_name: string;
  img_url: string | null;
  name: string;
  startdate: Date;
  user_id: number;
  uuid: string;
}

export interface APIResponseGetMarket {
  markets: MarketDataGet[];
  message: string;
  success: boolean;
}

export interface MarketDataCurr {
  imgUriCurr: string | null;
  marketNameCurr: string;
  marketUuid: string;
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
  startdate: Date;
  enddate: Date;
  img_name?: string;
  img_url?: string | null; 
}