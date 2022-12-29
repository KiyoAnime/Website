import {Component, onMount, ParentProps} from "solid-js";
import Navigation from "@/elements/Navigation";
import Container from "@/components/Container";

const PageBlock: Component<ParentProps<{ title?: string }>> = (props) => {
	onMount(() => {if (props.title) document.title = props.title});

	return (
		<>
			<Navigation/>
			<Container>
				{props.children}
			</Container>
		</>
	)
};

export default PageBlock;
