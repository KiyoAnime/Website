import http, {ApiRes} from "@/api/http";

interface UrlResponse extends ApiRes {
	data: string;
}

interface Response extends ApiRes {
	data: {
		type: 'LINK'|'LOGIN';
		cookie?: { key: string; value: string };
	}
}

export default (code: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/user/integrations/discord', { code: code }).then((res) => resolve(res.data)).catch(reject);
	});
};

export const getUrl = (): Promise<UrlResponse> => {
	return new Promise((resolve, reject) => {
		http.get('/user/integrations/discord').then((res) => resolve(res.data)).catch(reject);
	});
};
