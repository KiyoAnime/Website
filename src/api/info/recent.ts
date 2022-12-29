import http, {ApiRes} from "@/api/http";

interface Response extends ApiRes {
	data: RecentSeries[];
}

export interface RecentSeries {
	id: string;
	title: string;
	thumbnail: string;
}

const getRecent = (): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get('/info/recent').then((res) => resolve(res.data)).catch(reject);
	});
};

export default getRecent;
