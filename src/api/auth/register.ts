import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: string|null;
}

export default (email: string, username: string, password: string): Promise<Response> => {
	return new Promise((resolve, reject) =>{
		http.post('/auth/register', { email, username, password }).then((res) => resolve(res.data)).catch(reject);
	});
};
