import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: boolean;
}

export default (email: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/auth/check', { email }).then((res) => resolve(res.data)).catch(reject);
	});
};
