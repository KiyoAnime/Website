import axios from "axios";
import cookie from "js-cookie";

export interface ApiRes {
	code: string;
	error: boolean;
}

const http = axios.create({
	baseURL: 'https://kiyoapi.up.railway.app',
	headers: { Authorization: `Bearer ${cookie.get('token')}` }
});

export default http;
