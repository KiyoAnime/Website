import {Component, For, ParentProps} from "solid-js";
import {FormEvent} from "@/types";
import FormInput from "@/components/Form/FormInput";

interface Props {
	items: Item[];
	submitting: boolean;
	onSubmit: () => void;
	validation?: () => void;
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
		props.onSubmit();
	};

	return (
		<form onSubmit={submit} class={'flex flex-col py-3 px-2 gap-y-8'}>
			<For each={props.items}>
				{(item) => (
					<FormInput {...item} title={item.label}/>
				)}
			</For>
		</form>
	);
};

export default Form;
