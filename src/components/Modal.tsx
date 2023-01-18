import {Component, createEffect, createSignal, ParentProps, Show} from "solid-js";
import classNames from "classnames";
import Btn from "@/components/Button";
import Flash from "@/components/Flash";
import styles from '@/styles/modal.module.css';
import {Icon} from "solid-heroicons";
import {xMark} from "solid-heroicons/outline";

interface Props {
	key: string;
	open: boolean;
	title: string;
	style: string;
	resetFn?: () => void;
	button?: { label: string; loading: boolean; submit: () => void; };
}

const Modal: Component<ParentProps<Props>> = (props) => {
	const [open, setOpen] = createSignal(false);

	createEffect(() => {
		if (props.open) toggle(true);
	}, [props.open]);

	const toggle = (open: boolean) => {
		if (open) {
			setOpen(true);
			if (props.resetFn) props.resetFn();
			document.body.classList.add('overflow-hidden');
		} else {
			setOpen(false);
			document.body.classList.remove('overflow-hidden');
		}
	};

	return (
		<Show when={open()} keyed={false}>
			<div class={'absolute top-0 left-0 h-screen w-screen z-2 bg-black opacity-50'}/>
			<div class={classNames(styles.modal, props.style)}>
				<div class={'flex justify-center items-center'}>
					<h2 class={'ml-2 mt-0.5 mb-4'}>{props.title}</h2>
					<Icon
						path={xMark}
						onClick={() => toggle(false)}
						class={'fixed h-8 w-8 -top-3.5 -right-3.5 bg-secondary rounded-md cursor-pointer hover:bg-tertiary'}
					/>
				</div>
				<Flash key={props.key} type={'flex'} class={'h-9'} iconClass={'h-7 w-7'}/>
				{props.children}
				<Show when={props.button} keyed={false}>
					<div class={'absolute right-5 bottom-5'} onClick={props.button?.submit}>
						<Btn.Blue loading={props.button?.loading}>{props.button?.label}</Btn.Blue>
					</div>
				</Show>
			</div>
		</Show>
	);
};

export default Modal;
