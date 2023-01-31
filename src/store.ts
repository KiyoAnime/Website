import {createStore} from "solid-js/store";

interface Store {
	user?: UserStore;
	config?: ConfigStore;
}

export interface ConfigStore {
	autoNext: boolean;
	autoSkip: boolean;
	publicEmail: boolean;
	publicProfile: boolean;
}

export interface UserStore {
	_id: number;
	email: string;
	avatar?: string;
	username: string;
	profileName?: string;
	profile: {
		bio?: string;
		badges?: number[];
		gradient: { start: string; end: string; };
	};
	integrations: {
		discord?: {
			id: string;
			tag: string;
		};
	};
}

const [store, setStore] = createStore<Store>({ user: undefined });

export default store;
export const clearStore = () => setStore({ user: undefined, config: undefined });
export const setStoreUser = (data: UserStore) => setStore({ ...store, user: data });
export const setStoreConfig = (data: ConfigStore) => setStore({ ...store, config: data });
