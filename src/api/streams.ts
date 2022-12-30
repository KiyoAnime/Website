import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: Stream[];
}

export interface Stream {
	url: string;
	quality: string;
}

const getStreams = (episode: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/watch/${episode}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getStreams;
