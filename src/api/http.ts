import axios from "axios";

export interface ApiRes {
	code: string;
	error: boolean;
}

const http = axios.create({
	baseURL: 'https://kiyoapi.up.railway.app'
});

export default http;
