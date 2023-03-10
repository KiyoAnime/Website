import {Component, createSignal, onMount, Show} from "solid-js";
import classNames from "classnames";
import {Icon} from "solid-heroicons";
import {magnifyingGlass} from "solid-heroicons/outline";

const Search: Component<{ mobile?: boolean }> = (props) => {
    const [query, setQuery] = createSignal<string | undefined>();

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
        if (!query()) return;
        window.location.href = `/browse?query=${encodeURI(query()!)}`;
    };

    return (
        <div class={classNames('inline-flex items-center p-[0.15rem] w-full rounded-xl bg-gradient-to-br from-accent-pink to-accent-blue sm:w-64 lg:w-96')}>
            <input id={'search'} type={'text'} class={'w-full rounded-xl'} placeholder={'Search...'} onChange={({ currentTarget: { value } }) => setQuery(value)} onSubmit={submit}/>
            <Show when={props.mobile} keyed={false}>
                <Icon path={magnifyingGlass} class={'h-7 w-7 mx-2 cursor-pointer text-white'} onClick={submit}/>
            </Show>
        </div>
    );
};

export default Search;
