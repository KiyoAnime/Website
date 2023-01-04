import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: {
		total: number;
		episodes: Episode[];
	};
}

export interface Episode {
	id: string;
	number: number;
	source: string;
}

const getEpisodes = (series: number): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${series}/episodes`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getEpisodes;
