import {Component, JSX} from "solid-js";
import classNames from "classnames";

interface Props {
	id?: string;
	eId?: string;
	type: string;
	title: string;
	class?: string;
	placeholder?: string;
	onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;
}

const Input: Component<Props> = (props) => (
	<div id={props.eId} class={classNames('relative h-11 border-2 border-accent-blue rounded-md', props.class)}>
		<label class={'absolute -top-3 left-3 px-0.5 bg-primary'}>{props.title}</label>
		<input {...props} class={'h-full w-full bg-transparent'}/>
	</div>
);

export default Input;
