import {Component, createResource, For} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import search from "@/api/search";
import Card from "@/components/Card";

const Search: Component = () => {
	const { query } = useParams();

	const [results] = createResource(async () => {
		return await search(query).then((res) => res.data);
	});

	return (
		<PageBlock title={`Search • Kiyo`} loading={results.loading}>
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
