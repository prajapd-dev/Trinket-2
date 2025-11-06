export interface MarketEvent {
    name: string;
    startdate: Date;
    enddate: Date;
    img_url: string | null;
}

export interface CustomBooth {
    name: string, 
    number: number, 
    latitude: number,
    longitude: number
}