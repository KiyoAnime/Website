import {Component, For, Match, ParentProps, Switch} from "solid-js";
import {FormEvent} from "@/types";
import FormInput from "@/components/Form/FormInput";
import Btn from "@/components/Button";

type ButtonColor = 'red'|'blue'|'green';

export interface Value { [id: string]: string; }

interface Props {
	items: Item[];
	submitting: boolean;
	validation?: () => void;
	onSubmit: (values: Value) => void;
	button: { label: string; color: ButtonColor; };
}

interface Item {
	id: string;
	type: string;
	label: string;
	value?: string;
	placeholder?: string;
}

const Form: Component<ParentProps<Props>> = (props) => {
	const submit = (event: FormEvent) => {
		event.preventDefault();
		let values: Value = {};
		for (const item of props.items) {
			const input = document.getElementById(item.id) as HTMLInputElement;
			if (!input) return;
			values[item.id] = input.value;
		}
		props.onSubmit(values);
	};

	return (
		<form onSubmit={submit} class={'flex flex-col py-3 px-2 gap-y-8'}>
			<For each={props.items}>
				{(item) => (
					<FormInput {...item} title={item.label}/>
				)}
			</For>
			<div class={'flex justify-end'}>
				<Switch>
					<Match when={props.button.color === 'red'} keyed={false}>
						<Btn.Red type={'submit'} loading={props.submitting}>{props.button.label}</Btn.Red>
					</Match>
					<Match when={props.button.color === 'blue'} keyed={false}>
						<Btn.Blue type={'submit'} loading={props.submitting}>{props.button.label}</Btn.Blue>
					</Match>
					<Match when={props.button.color === 'green'} keyed={false}>
						<Btn.Green type={'submit'} loading={props.submitting}>{props.button.label}</Btn.Green>
					</Match>
				</Switch>
			</div>
		</form>
	);
};

export default Form;
