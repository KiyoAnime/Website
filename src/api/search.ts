import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: SearchResult[];
}

export interface SearchResult {
	id: string;
	title: string;
	episodes: number;
	released: number;
	thumbnail: string;
	type: 'TV'|'OVA'|'MOVIE'|'SPECIAL';
}

export default (query?: string, genres?: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/search${query ? `?query=${query}` : ''}${genres ? `${query ? '&' : '?'}genres=${genres}` : ''}`).then((res) => resolve(res.data)).catch(reject);
	});
};
