import {Component} from "solid-js";
import {IconI} from "@/types";
import {Icon} from "solid-heroicons";
import classNames from "classnames";

interface Props {
	icon: IconI;
	title: string;
	class?: string;
	description: string;
}

const Header: Component<Props> = (props) => (
	<div class={classNames('inline-flex items-center', props.class)}>
		<Icon path={props.icon} class={'mr-2 h-12 w-12 md:h-16 md:w-16'}/>
		<div class={'flex flex-col'}>
			<h2>{props.title}</h2>
			<span class={'hidden md:block'}>{props.description}</span>
		</div>
	</div>
);

export default Header;
