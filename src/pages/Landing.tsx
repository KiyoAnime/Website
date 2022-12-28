import {Component, createSignal, Match, Switch} from "solid-js";
import {supabase} from "@/App";
import store, {setStoreData} from "@/store";
import {Navigate} from "@solidjs/router";
import Navigation from "@/elements/Navigation";

const Landing: Component = () => {
	const [username, setUsername] = createSignal('');
	const [password, setPassword] = createSignal('');

	const submit = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({ email: username(), password: password() });
		if (error) alert(error);
		setStoreData(data.user);
		console.log(data, error);
		console.log(store.user);
	};

	const create = async () => {
		const { data, error } = await supabase.auth.signUp({ email: username(), password: password() });
		console.log(data, error);
	};

	return (
		<Switch>
			<Match when={!!store.user} keyed={false}>
				<Navigate href={'/home'}/>
			</Match>
			<Match when={!store.user} keyed={false}>
				<Navigation/>
			</Match>
		</Switch>
	);
};

export default Landing;
