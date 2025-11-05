export interface MarketEvent {
    user_id: number;
    name: string;
    startdate: Date;
    enddate: Date;
    img_name: string;
    img_url: string | null;
}

export interface CustomBooth {
    name: string, 
    number: number, 
    latitude: number,
    longitude: number
}