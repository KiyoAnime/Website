import {Component} from "solid-js";
import {A} from "@solidjs/router";

interface Props {
    id: string;
    title: string;
    thumbnail: string;
}

const SearchResults: Component<Props> = (props) => {
    return (
        <div class={'flex flex-col w-[9.5rem] sm:w-48'}>
            <A href={`/view/${props.id}`}>
                <img src={props.thumbnail} alt={props.title} class={'h-52 w-full rounded-xl sm:h-64 hover:duration-200 hover:scale-110'}/>
            </A>
            <span class={'mt-2.5 text-center line-clamp-2'}>{props.title}</span>
        </div>
    );
}

export default SearchResults;