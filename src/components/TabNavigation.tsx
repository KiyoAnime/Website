import {Accessor, Component, For} from "solid-js";
import {IconI} from "@/types";
import {A} from "@solidjs/router";
import {Icon} from "solid-heroicons";
import Btn from "@/components/Button";

interface Props {
	tabs: Tab[];
	base: string;
}

interface Tab {
	key: string;
	icon: IconI;
	label: string;
}

const TabNavigation: Component<Props> = (props) => {
	return (
		<div class={'inline-flex justify-center items-center h-12 w-full p-1 gap-x-1 bg-primary rounded-lg'}>
			<For each={props.tabs}>
				{(tab) => (
					<Btn.Text active={'bg-tertiary rounded-md'} url={`/${props.base}/${tab.key}`} nav>
						<Icon path={tab.icon} class={'h-7 w-7 mr-1.5'}/>
						<span>{tab.label}</span>
					</Btn.Text>
				)}
			</For>
		</div>
	);
};

export default TabNavigation;
