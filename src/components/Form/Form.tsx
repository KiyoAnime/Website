// noinspection InvisibleCharacter

import {Component, For, Match, ParentProps, Show, Switch} from "solid-js";
import {FormEvent, InputChangeEvent} from "@/types";
import FormInput from "@/components/Form/FormInput";
import Btn from "@/components/Button";
import classNames from "classnames";
import {Converter} from "showdown";

type ButtonColor = 'red'|'blue'|'green';
export interface Value { [id: string]: any; }

interface Props {
	items: Item[];
	class?: string;
	color?: string;
	submitting: boolean;
	validation?: () => void;
	onSubmit: (values: Value) => void;
	button?: { label: string; color: ButtonColor; };
}

interface Item {
	id: string;
	type: string;
	label: string;
	readonly?: boolean;
	placeholder?: string;
	value?: string|boolean;
	validation?: { type: 'string'|'number'|RegExp; message: string; };
}

export const clearError = (id: string) => {
	const parent = document.getElementById(`${id}-parent`) as HTMLDivElement;
	if (!parent) return;
	const error = document.getElementById(`${id}-error`) as HTMLSpanElement;
	if (!error) return;
	parent.classList.add('border-accent-blue');
	parent.classList.remove('border-red-500');
	error.innerText = ' ';
};

export const inputError = ({ id, items, message }: { id: string, items?: Item[], message?: string }) => {
	const parent = document.getElementById(`${id}-parent`) as HTMLDivElement;
	if (!parent) return;
	const error = document.getElementById(`${id}-error`) as HTMLSpanElement;
	if (!error) return;
	if (message) {
		error.innerText = message;
	} else if (items) {
		const item = items.find((i) => i.id === id);
		if (!item) return;
		error.innerText = item.validation?.message!;
	}
	parent.classList.add('border-red-500');
	parent.classList.remove('border-accent-blue');
};

const Form: Component<ParentProps<Props>> = (props) => {
	const submit = (event: FormEvent) => {
		event.preventDefault();
		let values: Value = {} as const;
		for (const item of props.items) {
			const input = document.getElementById(item.id) as HTMLInputElement;
			if (!input) return;

			switch (item.type) {
				case 'checkbox':
					values[item.id] = input.checked;
					break;

				case 'textarea':
					values[item.id] = new Converter().makeHtml(input.value);
					break;

				default:
					values[item.id] = input.value;
					break;
			}
		}

		props.onSubmit(values);
	};

	const change = (event: InputChangeEvent) => {
		const item = props.items.find((i) => i.id === event.currentTarget.id);
		if (!item) return;
		const { id, value } = event.currentTarget;
		if (!item.validation) return;
		if (item.validation.type instanceof RegExp) {
			if (item.validation.type.test(value)) return clearError(id); else return inputError({ id, items: props.items });
		} else {
			if (item.validation?.type === 'string' && value.length > 1) return clearError(id); else return inputError({ id, items: props.items });
		}
	};

	return (
		<form onSubmit={submit} class={'flex flex-col py-3 px-2'}>
			<div class={classNames('flex flex-col', props.items[0].type === 'checkbox' ? '' : 'gap-y-2', props.class)}>
				<For each={props.items}>
					{(item) => (
						<FormInput {...item} label={item.label} color={props.color} onChange={change}/>
					)}
				</For>
			</div>
			<Show when={props.children} keyed={false}>
				{props.children}
			</Show>
			<Show when={props.button} keyed={false}>
				<div class={'flex justify-end mt-1.5'}>
					<Switch>
						<Match when={props.button?.color === 'red'} keyed={false}>
							<Btn.Red type={'submit'} loading={props.submitting}>{props.button?.label}</Btn.Red>
						</Match>
						<Match when={props.button?.color === 'blue'} keyed={false}>
							<Btn.Blue type={'submit'} loading={props.submitting}>{props.button?.label}</Btn.Blue>
						</Match>
						<Match when={props.button?.color === 'green'} keyed={false}>
							<Btn.Green type={'submit'} loading={props.submitting}>{props.button?.label}</Btn.Green>
						</Match>
					</Switch>
				</div>
			</Show>
		</form>
	);
};

export default Form;
