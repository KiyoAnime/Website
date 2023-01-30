import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: {
		id: string;
        status: string;
        progress: string;
        aniauth: string;
	};
}

const syncAnime = (id: string, status: string, progress: string, aniauth: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/user/sync?id=${id}&status=${status}&progress=${progress}&aniauth=${aniauth}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default syncAnime;
