export interface MarketEvent {
    uuid: string;
    name: string;
    startdate: Date;
    enddate: Date;
    img_name: string; 
    img_url: string; // for get only
}

export interface CustomBooth {
    name: string, 
    number: number, 
    latitude: number,
    longitude: number
}