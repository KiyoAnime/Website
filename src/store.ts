import {createStore} from "solid-js/store";

interface Store {
	user?: UserStore;
}

export interface UserStore {
	_id: number;
	email: string;
	avatar?: string;
	username: string;
	profileName?: string;
	config: {
		publicEmail: boolean;
		publicProfile: boolean;
	};
	profile: {
		bio?: string;
		badges?: number[];
		gradient: { start: string; end: string; };
	};
}

const [store, setStore] = createStore<Store>({ user: undefined });

export default store;
export const clearStoreData = () => setStore({ user: undefined });
export const setStoreData = (data: UserStore) => setStore({ user: data });
