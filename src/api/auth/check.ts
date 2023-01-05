import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: boolean;
}

const check = (email: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/auth/check', { email: email }).then((res) => resolve(res.data)).catch(reject);
	});
};

export default check;
