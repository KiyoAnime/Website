import {Component, Match, ParentProps, Switch} from "solid-js";
import {Navigate} from "@solidjs/router";
import store from "@/store";
import Loader from "@/components/Loader";

const RestrictedRoute: Component<ParentProps<{ loading: boolean }>> = (props) => (
	<Switch fallback={<Loader/>}>
		<Match when={!props.loading && !store.user} keyed={false}>
			<Navigate href={'/'}/>
		</Match>
		<Match when={!props.loading && !!store.user} keyed={false}>
			{props.children}
		</Match>
	</Switch>
);

export default RestrictedRoute;
