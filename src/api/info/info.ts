import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: Anime;
}

interface Episode {
	id: string;
	number: number;
}

export interface Anime {
	id: number;
	title: string;
	color: string;
	banner: string;
	genres: string[];
	released: number;
	duration: number;
	subOrDub: string;
	thumbnail: string;
	popularity: number;
	description: string;
	episodeCount: number;
	episodes: Episode[]|undefined;
}

const getInfo = (id: number, episodes: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${id}?episodes=${episodes}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getInfo;
