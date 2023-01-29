import {Component, Show} from "solid-js";
import {Icon} from "solid-heroicons";
import {calendar, chartBar} from "solid-heroicons/outline";
import {Order} from "@/api/info/info";

const LongCard: Component<Order> = (props) => (
	<a href={`/view/${props.id}`} class={'flex flex-row h-[5.5rem] w-[19rem] bg-secondary rounded-lg'}>
		<img src={props.thumbnail} alt={props.title} class={'rounded-l-lg'}/>
		<div class={'flex flex-col py-2 px-3'}>
			<span class={'grow text-gray-200 line-clamp-2 leading-tight'}>{props.title}</span>
			<div class={'inline-flex items-center mt-1 text-gray-300'}>
				<Show when={props.rating} keyed={false}>
					<Icon path={chartBar} class={'h-4 w-4'}/>
					<span class={'ml-1 mr-2'}>{props.rating}%</span>
				</Show>
				<Icon path={calendar} class={'h-4 w-4'}/>
				<span class={'ml-1'}>{props.released}</span>
			</div>
		</div>
	</a>
);

export default LongCard;
