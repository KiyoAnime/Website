import {Component, For, JSX, ParentProps, Show} from "solid-js";
import {Icon} from "solid-heroicons";
import {chevronDoubleLeft, chevronDoubleRight} from "solid-heroicons/outline";
import classNames from "classnames";

interface Props {
	page: number;
	items: Item[];
	class?: string;
	back?: { disabled: string; onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> };
	forward?: { disabled: string; onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> };
}

interface Item extends ParentProps {
	id: number;
	onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

interface ItemProps {
	id: number;
	selected: boolean;
	onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

const Item: Component<ParentProps<ItemProps>> = (props) => (
	<button onClick={props.onClick} class={classNames(
		'h-9 w-9 rounded-lg hover:bg-tertiary',
		props.selected && 'text-gray-800 bg-accent-blue hover:bg-accent-blue-light'
	)}>
		<span class={'flex justify-center items-center'}>{props.children ? props.children : props.id}</span>
	</button>
);

const Pagination: Component<Props> = (props) => (
	<div class={classNames('flex justify-center gap-x-1', props.class)}>
		<Show when={props.back} keyed={false}>
			<Item id={-1} selected={false} onClick={props.back?.onClick!}>
				<Icon path={chevronDoubleLeft} class={classNames('h-5 w-5 text-white', props.page === 1 && props.back?.disabled)}/>
			</Item>
		</Show>
		<For each={props.items}>
			{(p) => (<Item id={p.id} selected={p.id === props.page} onClick={p.onClick}/>)}
		</For>
		<Show when={props.forward} keyed={false}>
			<Item id={-1} selected={false} onClick={props.forward?.onClick!}>
				<Icon path={chevronDoubleRight} class={classNames('h-5 w-5 text-white', props.page === props.items.length && props.forward?.disabled)}/>
			</Item>
		</Show>
	</div>
);

export default Pagination;
