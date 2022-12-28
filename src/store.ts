import {createStore} from "solid-js/store";
import {User} from "@supabase/supabase-js";

interface Store {
	user: UserStore|null;
}

interface UserStore {
	id: string;
	name: string;
	email: string;
	avatar: string;
}

const [store, setStore] = createStore<Store>({ user: null });

export default store;
export const clearStoreData = () => setStore({ user: null });
export const setStoreData = (data: UserStore) => setStore({ user: data });
