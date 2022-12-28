import {Component, onMount, ParentProps} from "solid-js";
import Navigation from "@/elements/Navigation";

const PageBlock: Component<ParentProps<{ title?: string }>> = (props) => {
	onMount(() => {if (props.title) document.title = props.title});

	return (
		<>
			<Navigation/>
			{props.children}
		</>
	)
};

export default PageBlock;
