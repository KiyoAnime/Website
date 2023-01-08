import {createStore} from "solid-js/store";
import {Component, JSXElement, Match, Show, Switch} from "solid-js";
import classNames from "classnames";
import {Icon} from "solid-heroicons";
import {checkCircle, exclamationCircle, informationCircle} from "solid-heroicons/outline";

interface Flash {
	type: Type;
	message: string;
}

interface RawFlash {
	type?: Type;
	message?: string;
}

type Type = 'error'|'warn'|'info'|'success';

const [flashStore, setFlashStore] = createStore<RawFlash>();
export const setFlash = (data: Flash): void => setFlashStore(data);
export const clearFlash = (): void => setFlashStore({ type: undefined, message: undefined });

interface FlashProps {
	style: string;
	class?: string;
	message: string;
	icon: {
		mini?: boolean;
		path: JSXElement;
		outline?: boolean
	};
}

const BaseFlash: Component<FlashProps> = (props) => (
	<div class={classNames('inline-flex items-center h-full w-full my-3 px-2 border-l-8 rounded', props.class, props.style)}>
		<Icon path={props.icon}/>
		<span class={'ml-1.5 text-gray-100'}>{props.message}</span>
	</div>
);

const Flash: Component<{ class?: string }> = (props) => {
	const msg = () => flashStore.message as string;

	return (
		<div class={'h-8 w-full mb-2'}>
			<Show when={flashStore.message} keyed={false}>
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
			</Show>
		</div>
	);
};

export default Flash;
