import {Component, ParentProps, Show} from "solid-js";
import {useRouteData} from "@solidjs/router";
import {animeData} from "@/App";

const Item: Component<ParentProps<{ title: string }>> = (props) => (
	<div class={'flex flex-col'}>
		<h4>{props.title}:</h4>
		<div class={'flex flex-col mt-2 p-2 bg-secondary rounded-lg'}>
			{props.children}
		</div>
	</div>
);

const Advanced: Component = () => {
	const info = useRouteData<typeof animeData>();

	return (
		<Show when={!info.loading} keyed={false}>
			<Item title={'Titles'}>
				<Show when={info()?.titles.english!} keyed={false}>
					<span>English: {info()?.titles.english}</span>
				</Show>
				<Show when={info()?.titles.romaji!} keyed={false}>
					<span>Romaji: {info()?.titles.romaji}</span>
				</Show>
				<Show when={info()?.titles.native!} keyed={false}>
					<span>Native: {info()?.titles.native}</span>
				</Show>
			</Item>
		</Show>
	);
};

export default Advanced;
