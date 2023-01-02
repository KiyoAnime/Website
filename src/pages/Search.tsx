import {Component, createSignal, For, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import search, {SearchResults} from "@/api/search";
import Card from "@/components/Card";

const Search: Component = () => {
	const { query } = useParams();
	const [results, setResults] = createSignal<SearchResults[]|undefined>();

	onMount(() => {
		search(query).then((res) => setResults(res.data));
	});

	return (
		<PageBlock title={`Search • Kiyo`}>
			<section>
				<h2>Results for: <span class={'text-gray-400'}>{decodeURI(query)}</span></h2>
				<div class={'card-grid mt-6'}>
					<For each={results()} fallback={<h3>Loading...</h3>}>
						{(r) => <Card id={r.id} title={r.title} thumbnail={r.thumbnail}/>}
					</For>
				</div>
			</section>
		</PageBlock>
	);
};

export default Search;
