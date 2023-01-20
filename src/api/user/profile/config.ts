import http, {ApiRes} from "@/api/http";

interface Data {
	publicEmail: boolean;
	publicProfile: boolean;
}

interface Response extends ApiRes {
	data?: string;
}

export default (data: Data): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/user/profile/config', data).then((res) => resolve(res.data)).catch(reject);
	});
};
