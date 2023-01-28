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
	sub: boolean;
	dub: boolean;
	type: string;
	title: string;
	adult: boolean;
	banner: string;
	rating: number;
	genres: string[];
	released: number;
	thumbnail: string;
	description: string;
	episodeCount: number;
	episodes: Episode[]|undefined;
	watchOrder?: WatchOrder[]|undefined;
	end?: { day: number; month: number; year: number; };
	start: { day: number; month: number; year: number; };
}

const getInfo = (id: number, episodes: boolean, order: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${id}?episodes=${episodes}&order=${order}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getInfo;
