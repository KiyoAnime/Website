import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: SearchResults[];
}

export interface SearchResults {
	id: string;
	title: string;
	episodes: number;
	released: number;
	thumbnail: string;
	type: 'TV'|'OVA'|'MOVIE'|'SPECIAL';
}

const search = (query: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/search?query=${query}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default search;
