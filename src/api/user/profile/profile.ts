import http, { ApiRes } from "@/api/http";

interface Response extends ApiRes {
	data: ProfileResult;
}

export interface ProfileResult {
	_id: string;
	avatar: string;
	username: string;
	profileName: string
	profile: {
		badges: [];
		gradient: {
			start: string;
			end: string;
		}
	}
}

export default (query: string): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get(`/user/profile/${query}`).then((res) => resolve(res.data)).catch(reject);
	});
};
