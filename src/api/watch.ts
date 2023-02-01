import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: {
		url?: string;
		embedded: string;
		episode?: number;
		progress?: number;
	};
}

const getUrl = (anime: number, episode: string, dub: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		if (!dub) {
			http.get(`/watch/${anime}/${episode}`).then((res) => resolve(res.data)).catch(reject);
		} else {
			const dubEp = episode.replace('-episode-', '-dub-episode-');
			http.get(`/watch/${anime}/${dubEp}`).then((res) => resolve(res.data)).catch(reject);
		}
	});
};

export default getUrl;
