import http, {ApiRes} from "@/api/http";

interface Data {
	id: number;
	episode: number;
	progress: number;
}

export default (data: Data): Promise<ApiRes> => {
	return new Promise((resolve, reject) => {
		http.post('/user/progress', data).then((res) => resolve(res.data)).catch(reject);
	});
};
