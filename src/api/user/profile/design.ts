import http, {ApiRes} from "@/api/http";

interface Data {
	gradient: {
		end: string;
		start: string;
	}
}

interface Response extends ApiRes {
	data?: string;
}

export default (data: Data): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/user/profile/design', data).then((res) => resolve(res.data)).catch(reject);
	});
};
