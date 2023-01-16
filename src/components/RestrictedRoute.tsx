import {Component, createEffect, createSignal, Match, ParentProps, Switch} from "solid-js";
import {Navigate} from "@solidjs/router";
import store from "@/store";
import Loader from "@/components/Loader";

const RestrictedRoute: Component<ParentProps<{ loading: boolean }>> = (props) => {
	const [loading, setLoading] = createSignal(true);

	createEffect(() => {
		setLoading(props.loading);
	}, [props.loading])

	return (
		<Switch fallback={<Loader/>}>
			<Match when={loading() && !store.user} keyed={false}>
				<Navigate href={'/'}/>
			</Match>
			<Match when={!loading() && !!store.user} keyed={false}>
				{props.children}
			</Match>
		</Switch>
	);
};

export default RestrictedRoute;
