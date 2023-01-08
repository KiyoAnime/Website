import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: { key: string; value: string; };
}

export default (email: string, password: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/auth/login', { email , password }).then((res) => resolve(res.data)).catch(reject);
	});
};
