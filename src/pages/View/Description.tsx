import {Component, Show} from "solid-js";
import {useRouteData} from "@solidjs/router";
import {animeData} from "@/App";

const Description: Component = () => {
	const data = useRouteData<typeof animeData>();

	return (
		<Show when={!data.loading} keyed={false}>
			<p innerHTML={data()?.description}/>
		</Show>
	);
};

export default Description;
