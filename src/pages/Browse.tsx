import {Component, createSignal, For, createResource} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {parse} from "querystring";
import Box from "@/components/Box";
import {informationCircle} from "solid-heroicons/solid";
import {InputClickEvent} from "@/types";
import search from "@/api/search";
import Card from "@/components/Card";
import { genres } from "@/helpers";

const Browse: Component = () => {
	const [query, setQuery] = createSignal<string|undefined>();
	const [selectedGenres, setSelectedGenres] = createSignal<string[]>([]);

	if (location.search) setQuery(Object.fromEntries(new URLSearchParams(location.search)).query);
	const [animes, { refetch }] = createResource(async () => {
		return await search(query(), selectedGenres().length > 0 ? `[${selectedGenres().join(',')}]` : undefined).then((res) => res.data);
	});

	const toggle = (event: InputClickEvent) => {
		const genre = event.currentTarget.name;
		if (selectedGenres().includes(genre)) {
			const newGenres = selectedGenres().filter((g) => g !== genre);
			setSelectedGenres(newGenres);
		} else setSelectedGenres([...selectedGenres(), genre]);
		refetch();
	};

	return (
		<PageBlock title={'Browse • Kiyo'}>
			<div class={'flex flex-col justify-center lg:flex-row lg:justify-between'}>
				<div class={'grid grid-cols-2 justify-items-center mt-4 order-2 gap-x-4 gap-y-10 lg:order-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
					<For each={animes()}>
						{(a) => (<Card {...a}/>)}
					</For>
				</div>
				<Box icon={informationCircle} title={'Genres'} class={'w-full h-fit order-1 lg:order-2 md:w-[38%] lg:w-[28%] xl:w-[20%]'} cClass={'grid grid-cols-2 py-0 px-3'}>
					<For each={genres}>
						{(g) => (
							<div class={'inline-flex items-center'}>
								<input type={'checkbox'} name={`"${g}"`} class={'mr-1.5'} onClick={toggle}/>
								<label for={`"${g}"`}>{g}</label>
							</div>
						)}
					</For>
				</Box>
			</div>
		</PageBlock>
	);
};

export default Browse;
