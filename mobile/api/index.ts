import axios from "axios"; 
import { API_BASE_URL } from "../type/type";

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json", //what we are sending
        Accept: "application/json", // how we expect to receive our data
    }
});

//add interceptors for auth later