import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: Anime;
}

export interface Anime {
	id: number;
	title: string;
	color: string;
	banner: string;
	genres: string[];
	released: number;
	episodes: number;
	duration: number;
	subOrDub: string;
	thumbnail: string;
	popularity: number;
	description: string;
}

const getInfo = (id: number): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/info/${id}`).then((res) => resolve(res.data)).catch(reject);
	});
};

export default getInfo;
