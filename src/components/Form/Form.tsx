import {Component, For, Match, ParentProps, Show, Switch} from "solid-js";
import {FormEvent} from "@/types";
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
	placeholder?: string;
	value?: string|boolean;
}

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

	return (
		<form onSubmit={submit} class={'flex flex-col py-3 px-2'}>
			<div class={classNames('flex flex-col', props.items[0].type === 'checkbox' ? '' : 'gap-y-6', props.class)}>
				<For each={props.items}>
					{(item) => (
						<FormInput {...item} label={item.label} color={props.color}/>
					)}
				</For>
			</div>
			<Show when={props.children} keyed={false}>
				{props.children}
			</Show>
			<Show when={props.button} keyed={false}>
				<div class={'flex justify-end mt-6'}>
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
