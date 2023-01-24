import {Component, JSX, Match, splitProps, Switch} from "solid-js";
import classNames from "classnames";
import styles from '@/styles/input.module.css';

export interface Props {
	id?: string;
	eId?: string;
	type: string;
	label: string;
	class?: string;
	labelBg?: string;
	readonly?: boolean;
	placeholder?: string;
	value?: string|boolean;
	onChange?: JSX.EventHandlerUnion<HTMLInputElement|HTMLTextAreaElement, Event>;
}

const Input: Component<Props> = (props) => {
	const [local, others] = splitProps(props, ['eId', 'label', 'value', 'class', 'labelBg']);

	return (
		<Switch fallback={
			<div class={'flex flex-col'}>
				<div id={local.eId ? local.eId : `${others.id}-parent`} class={classNames('relative h-11 border-2 border-accent-blue rounded-md', local.class)}>
					<label class={classNames('absolute -top-3 left-3 px-0.5', local.labelBg ? local.labelBg : 'bg-primary')}>{local.label}</label>
					<input {...others} value={local.value as string} class={'h-full w-full bg-transparent'} autocomplete={'off'}/>
				</div>
				<span id={`${props.id}-error`} class={'inline-block text-sm text-red-500'}>&nbsp;</span>
			</div>
		}>
			<Match when={props.type === 'checkbox'} keyed={false}>
				<div id={local.eId} class={classNames('flex justify-between items-center h-8 my-2 first:mt-0 last:mb-0', local.class)}>
					<label>{local.label}</label>
					<input {...others} class={styles.toggle} checked={local.value as boolean}/>
				</div>
			</Match>
			<Match when={props.type === 'textarea'} keyed={false}>
				<div id={local.eId} class={classNames('relative h-40 border-2 border-accent-blue rounded-md', local.class)}>
					<label class={classNames('absolute -top-3 left-3 px-0.5', local.labelBg ? local.labelBg : 'bg-primary')}>{local.label}</label>
					<textarea {...others} value={local.value as string} class={'h-full w-full p-2 resize-none bg-transparent outline-none'}/>
				</div>
			</Match>
			<Match when={props.type === 'color'} keyed={false}>
				<div id={local.eId} class={classNames('flex flex-col', local.class)}>
					<label>{local.label}</label>
					<input {...others} value={local.value as string} class={'h-11 w-full p-0 bg-transparent border-2 border-accent-blue rounded-md'}/>
				</div>
			</Match>
		</Switch>
	)
};

export default Input;
