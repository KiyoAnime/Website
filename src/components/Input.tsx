import {Component, JSX} from "solid-js";
import classNames from "classnames";

export interface Props {
	id?: string;
	eId?: string;
	type: string;
	title: string;
	value?: string;
	class?: string;
	labelBg?: string;
	readonly?: boolean;
	placeholder?: string;
	onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;
}

const Input: Component<Props> = (props) => (
	<div id={props.eId} class={classNames('relative h-11 border-2 border-accent-blue rounded-md', props.class)}>
		<label class={classNames('absolute -top-3 left-3 px-0.5', props.labelBg ? props.labelBg : 'bg-primary')}>{props.title}</label>
		<input {...props} class={'h-full w-full bg-transparent'}/>
	</div>
);

export default Input;
