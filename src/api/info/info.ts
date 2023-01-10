import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: Anime;
}

interface Episode {
	id: string;
	number: number;
}

interface WatchOrder {
	index: number;
	name: string;
	id: number;
	info: string;
	url: string;
}

export interface Anime {
	id: number;
	mal: number;
	type: string;
	title: string;
	color: string;
	adult: boolean;
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
	watchOrder: WatchOrder[]|undefined;
	end: { month: number; year: number; day: number; };
	start: { month: number; year: number; day: number; };
}

const getInfo = (id: number, episodes: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${id}?episodes=${episodes}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getInfo;
