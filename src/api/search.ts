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

export default (query?: string, genres?: string, page?: number): Promise<Response> => {
	const queryVar = query ? `?query=${query}` : '';
	const genresVar = genres ? `${query ? '&' : '?'}genres=${genres}` : '';
	const pageVar = page ? `${query || genres ? '&' : '?'}page=${page}` : '';
	return new Promise((resolve, reject) => {
		http.get(`/search${queryVar}${genresVar}${pageVar}`).then((res) => resolve(res.data)).catch(reject);
	});
};
