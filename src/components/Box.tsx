import {Component, Match, ParentProps, Switch} from "solid-js";
import {IconI} from "@/types";
import classNames from "classnames";
import {Icon} from "solid-heroicons";

interface Props {
	icon: IconI|string;
	title: string;
	class?: string;
	cClass?: string;
}

const Box: Component<ParentProps<Props>> = (props) => (
	<div class={classNames('flex flex-col mt-4 h-auto bg-secondary rounded-md', props.class)}>
		<span class={'inline-flex items-center h-11 p-2 bg-primary rounded-t-md'}>
			<Switch>
				<Match when={typeof props.icon !== 'string'} keyed={false}>
					<Icon path={props.icon as IconI} class={'h-7 w-7 mr-1.5'}/>
				</Match>
				<Match when={typeof props.icon === 'string'} keyed={false}>
					<img src={props.icon as string} alt={props.title} class={'h-7 w-7 mr-1.5'}/>
				</Match>
			</Switch>
			<h5>{props.title}</h5>
		</span>
		<div class={classNames('py-1 px-2', props.cClass)}>
			{props.children}
		</div>
	</div>
);

export default Box;
