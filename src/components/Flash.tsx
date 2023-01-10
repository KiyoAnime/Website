import {createStore} from "solid-js/store";
import {Component, JSXElement, Match, Show, Switch} from "solid-js";
import classNames from "classnames";
import {Icon} from "solid-heroicons";
import {checkCircle, exclamationCircle, informationCircle} from "solid-heroicons/outline";

interface Flash {
	type: Type;
	key: string;
	message: string;
}

interface RawFlash {
	type?: Type;
	key?: string;
	message?: string;
}

interface FlashProps {
	key: string;
	class?: string;
	iconClass?: string;
	type: 'flex'|'static';
}

interface BaseFlashProps {
	style: string;
	class?: string;
	message: string;
	iconClass?: string;
	icon: {
		mini?: boolean;
		path: JSXElement;
		outline?: boolean
	};
}

type Type = 'error'|'warn'|'info'|'success';

const [flashStore, setFlashStore] = createStore<RawFlash>();
export const setFlash = (data: Flash): void => setFlashStore(data);
export const clearFlash = (): void => setFlashStore({ key: undefined, type: undefined, message: undefined });

const BaseFlash: Component<BaseFlashProps> = (props) => (
	<div class={classNames('inline-flex items-center h-full w-full px-2 border-l-8 rounded', props.style)}>
		<Icon path={props.icon} class={classNames('h-8 w-8', props.iconClass)}/>
		<span class={'ml-1.5 text-gray-100 lg:text-lg'}>{props.message}</span>
	</div>
);

const FlashComp: Component<FlashProps> = (props) => {
	const msg = () => flashStore.message as string;

	return (
		<Switch>
			<Match keyed={false} when={flashStore.type === 'info'}>
				<BaseFlash {...props} message={msg()} icon={informationCircle} style={'bg-blue-500/25 border-blue-500'}/>
			</Match>
			<Match keyed={false} when={flashStore.type === 'warn'}>
				<BaseFlash {...props} message={msg()} icon={exclamationCircle} style={'bg-yellow-500/25 border-yellow-600'}/>
			</Match>
			<Match keyed={false} when={flashStore.type === 'error'}>
				<BaseFlash {...props} message={msg()} icon={exclamationCircle} style={'bg-red-500/25 border-red-600'}/>
			</Match>
			<Match keyed={false} when={flashStore.type === 'success'}>
				<BaseFlash {...props} message={msg()} icon={checkCircle} style={'bg-green-500/25 border-green-600'}/>
			</Match>
		</Switch>
	);
};

const Flash: Component<FlashProps> = (props) => {
	return (
		<Switch>
			<Match when={props.type === 'flex'} keyed={false}>
				<Show when={flashStore.message && props.key === flashStore.key} keyed={false}>
					<div class={classNames('h-12 w-full my-2', props.class)}>
						<FlashComp {...props}/>
					</div>
				</Show>
			</Match>
			<Match when={props.type === 'static'} keyed={false}>
				<div class={classNames('h-12 w-full my-2', props.class)}>
					<Show when={flashStore.message && props.key === flashStore.key} keyed={false}>
						<FlashComp {...props}/>
					</Show>
				</div>
			</Match>
		</Switch>
	);
};

export default Flash;
