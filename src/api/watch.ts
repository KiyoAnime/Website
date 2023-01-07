import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: {
		url: string|undefined;
		embedded: string;
	};
}

const getUrl = (episode: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/watch/${episode}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getUrl;
