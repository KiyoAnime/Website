import {Component, createSignal, ParentProps, Show} from "solid-js";
import classNames from "classnames";
import Btn from "@/components/Button";
import Flash from "@/components/Flash";

interface Props {
	open: boolean;
	title: string;
	style: string;
	btnText: string;
	btnLoading: boolean;
	btnSubmit: () => void;
}

const Modal: Component<ParentProps<Props>> = (props) => {
	return (
		<Show when={props.open} keyed={false}>
			<div class={classNames('absolute top-1/2 inset-x-0 -translate-y-1/2 my-auto mx-auto p-3 bg-slate-700 rounded-2xl', props.style)}>
				<h2 class={'text-center'}>{props.title}</h2>
				<Flash/>
				{props.children}
				<div class={'absolute right-4 bottom-4'} onClick={props.btnSubmit}>
					<Btn.Blue loading={props.btnLoading}>{props.btnText}</Btn.Blue>
				</div>
			</div>
		</Show>
	);
};

export default Modal;
