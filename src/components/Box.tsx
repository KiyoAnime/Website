import {Component, ParentProps} from "solid-js";
import {IconI} from "@/types";
import classNames from "classnames";
import {Icon} from "solid-heroicons";

interface Props {
	icon: IconI;
	title: string;
	class?: string;
}

const Box: Component<ParentProps<Props>> = (props) => (
	<div class={classNames('flex flex-col mt-4 h-auto bg-secondary rounded-md', props.class)}>
		<span class={'inline-flex items-center h-11 p-2 bg-primary rounded-t-md'}>
			<Icon path={props.icon} class={'h-7 w-7 mr-1'}/>
			<h5>{props.title}</h5>
		</span>
		<div class={'py-1 px-2'}>
			{props.children}
		</div>
	</div>
);

export default Box;
