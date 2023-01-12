import {Accessor, Component, For} from "solid-js";
import {IconI} from "@/types";
import {A} from "@solidjs/router";
import {Icon} from "solid-heroicons";

interface Props {
	tabs: Tab[];
	base: string;
}

interface Tab {
	key: string;
	icon: IconI;
	title: string;
}

const TabNavigation: Component<Props> = (props) => {


	return (
		<div class={'inline-flex justify-center items-center h-12 w-full p-2 gap-x-4 bg-primary rounded-lg'}>
			<For each={props.tabs}>
				{(tab) => (
					<A href={`/${props.base}/${tab.key}`} activeClass={'text-accent-pink'} class={'inline-flex items-center'} end>
						<Icon path={tab.icon} class={'h-7 w-7 mr-1'}/>
						<span class={'text-md'}>{tab.title}</span>
					</A>
				)}
			</For>
		</div>
	);
};

export default TabNavigation;
