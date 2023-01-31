import http, {ApiRes} from "@/api/http";

interface PlayerData {
	autoNext: boolean;
	autoSkip: boolean;
}

interface Data {
	email: string;
	avatar: string;
	profileName: string;
}

interface Response extends ApiRes {
	data?: string;
}

export default (data: Data): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/user', data).then((res) => resolve(res.data)).catch(reject);
	});
};

export const updatePlayer = (data: PlayerData): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.post('/user/player', data).then((res) => resolve(res.data)).catch(reject);
	});
};
