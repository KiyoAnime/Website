import {Component, Match, ParentProps, Switch} from "solid-js";
import {getUser, supabase} from "@/App";
import {Navigate} from "@solidjs/router";
import store from "@/store";

const RestrictedRoute: Component<ParentProps<{ loaded: boolean }>> = (props) => {
	return (
		<Switch fallback={<h3>Loading...</h3>}>
			<Match when={props.loaded && !store.user} keyed={false}>
				<Navigate href={'/'}/>
			</Match>
			<Match when={props.loaded && !!store.user} keyed={false}>
				{props.children}
			</Match>
		</Switch>
	);
};

export default RestrictedRoute;
