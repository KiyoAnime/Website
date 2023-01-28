import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: Trending[];
}

export interface Trending {
	id: number;
	title: string;
	banner: string;
	episodes: number;
	released: number;
	description: string;
}

const getTrending = (): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get('/info/trending').then((res) => resolve(res.data)).catch(reject);
	});
};

export default getTrending;
