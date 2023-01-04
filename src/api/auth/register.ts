import http, {ApiRes} from "@/api/http";

const register = (email: string, username: string, password: string): Promise<ApiRes> => {
	return new Promise((resolve, reject) =>{
		http.post('/auth/login', { email: email, username: username, password: password }).then((res) => resolve(res.data)).catch(reject);
	});
};

export default register;
