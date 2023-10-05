import axios from "axios";


const baseUrl = "http://localhost:3010";

const API = axios.create({
    baseURL:baseUrl,
    timeout:3000,
    headers:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
});

export { API };