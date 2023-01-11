import {Component, Match, ParentProps, Switch} from "solid-js";
import {Navigate} from "@solidjs/router";
import store from "@/store";

const RestrictedRoute: Component<ParentProps<{ loading: boolean }>> = (props) => (
	<Switch>
		<Match when={!props.loading && !store.user} keyed={false}>
			<Navigate href={'/'}/>
		</Match>
		<Match when={!props.loading && !!store.user} keyed={false}>
			{props.children}
		</Match>
	</Switch>
);

export default RestrictedRoute;
