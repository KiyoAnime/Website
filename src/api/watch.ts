import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: {
		url: string|undefined;
		embedded: string;
	};
}

const getUrl = (episode: string, dub: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		if (!dub) {
			http.get(`/watch/${episode}`).then((res) => resolve(res.data)).catch(reject);
		} else {
			const dubEp = episode.replace('-episode-', '-dub-episode-');
			http.get(`/watch/${dubEp}`).then((res) => resolve(res.data)).catch(reject);
		}
	});
};

export default getUrl;
