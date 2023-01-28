import {Component, Show} from "solid-js";
import {useRouteData} from "@solidjs/router";
import {animeData} from "@/App";

const Description: Component = () => {
	const info = useRouteData<typeof animeData>();

	return (
		<Show when={!info.loading} keyed={false}>
			<p innerHTML={info()?.description}/>
		</Show>
	);
};

export default Description;
