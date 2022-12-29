import {Component} from "solid-js";

interface Props {
	id: string;
	title: string;
	thumbnail: string;
}

const Card: Component<Props> = (props) => {
	return (
		<div class={'flex flex-col w-48'}>
			<img src={props.thumbnail} alt={props.title} class={'h-64 w-full rounded-xl'}/>
			<span class={'mt-0.5 text-center line-clamp-2'}>{props.title}</span>
		</div>
	);
};

export default Card;
