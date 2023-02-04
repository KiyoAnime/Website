import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: Anime;
}

interface OrderResponse extends ApiRes {
	data: Order[];
}

export interface Episode {
	id: string;
	number: number;
}

export interface Order {
	id: number;
	title: string;
	index: number;
	rating?: number;
	released: number;
	thumbnail: string;
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
	rating?: number;
	genres: string[];
	released: number;
	thumbnail: string;
	progress?: number;
	description: string;
	episodes?: Episode[];
	episodeCount: number;
	end?: { day: number; month: number; year: number; };
	start: { day: number; month: number; year: number; };
	titles: { english?: string; romaji?: string; native?: string; };
}

const getInfo = (id: number, episodes: boolean, progress: boolean): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${id}?episodes=${episodes}${progress ? `&progress=true` : ''}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export const getOrder = (id: number): Promise<OrderResponse> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${id}/order`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getInfo;
