import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: {
		url: string|undefined;
		embedded: string;
	};
}

const getUrl = (episode: string, dub: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		let dubep = episode.replace('-episode-', '-dub-episode-')
		if (dub)
			http.get(`/watch/${dubep}`).then((res) => resolve(res.data)).catch(reject);
		else
			http.get(`/watch/${episode}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getUrl;
