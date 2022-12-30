import {Component, createSignal} from "solid-js";
import getSearch from "@/api/search";
import SearchResults from "@/components/SearchResults";
const Search: Component = () => {
    const [search, setSearch] = createSignal<SearchResults | null>(null);
    return (
        <div class={'flex flex-col items-center justify-center ml-16'}>
            <input class={'bg-primary text-white rounded-xl p-2 w-96 border-2 border-secondary text-gray-200'} placeholder={'Search...'}
                   onChange={(e) => { getSearch(e.target.value).then((res) => setSearch(res.data)) }}/>
            <div class={'flex flex-wrap justify-center mt-4'}>
                {search() !== null && search().results.map((res) => () => <SearchResults id={res.id} title={res.title} thumbnail={res.thumbnail}/>)}
            </div>
        </div>
        // <div class={"p-0.5 ml-16 w-96 rounded-full max-w-sm bg-gradient-to-r from-[#3E9AD2] to-[#CA52B2]"}>
        //     <input class={"p-2 w-full rounded-full focus:outline-none bg-primary"} type="text" id="search" placeholder="Search..."/>
        // </div>
    )
}

export default Search;