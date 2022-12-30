import {Component, createSignal, onMount} from "solid-js";
import getSearch from "@/api/search";
import SearchResults from "@/components/SearchResults";
import {Navigate} from "@solidjs/router";

const Search: Component = () => {
    const [query, setQuery] = createSignal<string|undefined>();

    onMount(() => {
        const input = document.getElementById('search');
        if (!input) return;
        input.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.code !== 'Enter') return;
            submit();
        });
    });

    const submit = () => {
        window.location.href = `/search/${query()}`;
    };

    return (
        <div class={'p-0.5 w-96 rounded-xl max-w-sm bg-gradient-to-br from-accent-pink to-accent-blue'}>
            <input type={'text'} id={'search'} class={'w-full rounded-xl'} placeholder={'Search...'} onChange={({ currentTarget: { value } }) => setQuery(value)}/>
        </div>
    );
};

export default Search;
