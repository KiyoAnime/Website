import {Component, createSignal, For, createResource, ParentProps, JSX} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import Box from "@/components/Box";
import {InputClickEvent} from "@/types";
import search from "@/api/search";
import Card from "@/components/Card";
import { genres } from "@/helpers";
import {adjustmentsHorizontal, chevronDoubleLeft, chevronDoubleRight} from "solid-heroicons/outline";
import {createStore} from "solid-js/store";
import Btn from "@/components/Button";
import classNames from "classnames";
import {Icon} from "solid-heroicons";
import Pagination from "@/components/Pagination";

const Browse: Component = () => {
	const [query, setQuery] = createSignal<string|undefined>();
	const [selectedGenres, setSelectedGenres] = createSignal<string[]>([]);
	const [page, setPage] = createSignal(1);

	if (location.search) setQuery(Object.fromEntries(new URLSearchParams(location.search)).query);
	const [animes, { refetch }] = createResource(async () => {
		return await search(query(), selectedGenres().length > 0 ? `[${selectedGenres().join(',')}]` : undefined, page()).then((res) => res.data);
	});

	const toggle = (event: InputClickEvent) => {
		const genre = event.currentTarget.name;
		if (selectedGenres().includes(genre)) {
			const newGenres = selectedGenres().filter((g) => g !== genre);
			setSelectedGenres(newGenres);
		} else setSelectedGenres([...selectedGenres(), genre]);
		refetch();
	};

	const changePage = (page: number) => {
		setPage(page);
		refetch();
	};

	return (
		<PageBlock title={'Browse'}>
			<div class={'flex flex-col justify-center lg:flex-row lg:justify-between'}>
				<div class={'grid grid-cols-2 justify-items-center mt-4 order-2 gap-x-4 gap-y-10 lg:order-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
					<For each={animes()}>
						{(a) => (<Card {...a}/>)}
					</For>
				</div>
				<Box icon={adjustmentsHorizontal} title={'Genres'} class={'w-full h-fit order-1 lg:order-2 md:w-[38%] lg:w-[28%] xl:w-[20%]'} cClass={'grid grid-cols-2 py-0 px-3'}>
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
			<Pagination
				page={page()}
				class={'mt-2'}
				items={[
					{ id: 1, onClick: () => changePage(1) },
					{ id: 2, onClick: () => changePage(2) },
					{ id: 3, onClick: () => changePage(3) },
					{ id: 4, onClick: () => changePage(4) },
					{ id: 5, onClick: () => changePage(5) },
					{ id: 6, onClick: () => changePage(6) },
					{ id: 7, onClick: () => changePage(7) },
					{ id: 8, onClick: () => changePage(8) },
					{ id: 9, onClick: () => changePage(9) },
					{ id: 10, onClick: () => changePage(10) }
				]}
				back={{ disabled: 'text-gray-400', onClick: () => changePage(page() > 1 ? page() - 1 : 1) }}
				forward={{ disabled: 'text-gray-400', onClick: () => changePage(page() < 10 ? page() + 1 : 10) }}
			/>
		</PageBlock>
	);
};

export default Browse;
