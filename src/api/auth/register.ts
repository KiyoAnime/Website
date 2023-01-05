import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: string|null;
}

const register = (email: string, username: string, password: string): Promise<Response> => {
	return new Promise((resolve, reject) =>{
		http.post('/auth/register', { email: email, username: username, password: password }).then((res) => resolve(res.data)).catch(reject);
	});
};

export default register;
