import {Component, createSignal, Match, Switch} from "solid-js";
import store from "@/store";
import {Navigate} from "@solidjs/router";
import Navigation from "@/elements/Navigation";
import Container from "@/components/Container";

const Landing: Component = () => {
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
