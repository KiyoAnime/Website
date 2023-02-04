import http, {ApiRes} from "@/api/http";

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
