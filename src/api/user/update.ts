import http, {ApiRes} from "@/api/http";

interface Data {
	email: string;
	avatar: string;
	profileName: string;
}

interface Response extends ApiRes {
	data?: string;
}

export default (data: Data): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/user', data).then((res) => resolve(res.data)).catch(reject);
	});
};
