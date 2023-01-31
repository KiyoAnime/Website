import http, {ApiRes} from "@/api/http";
import {UserStore} from "@/store";

interface Response extends ApiRes {
	data: any;
}

export default (): Promise<Response> => {
	return new Promise((resolve, reject) => {
		http.get('/user').then((res) => resolve(res.data)).catch(reject);
	});
};
