import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: SearchResults[];
}

export interface SearchResults {
	id: string;
	title: string;
	thumbnail: string;
    description: string;
    rating: number | null;
    episodes: number | null;
    type: string;
    release: string | null;
}


const getSearch = (q: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		const req = http.get(`/search?query=${q}`).then((res => resolve(res.data))).catch((err) => { reject(err) });
	});
};

export default getSearch;
