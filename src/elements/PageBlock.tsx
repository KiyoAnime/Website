import {Component, onMount, ParentProps} from "solid-js";
import Navigation from "@/elements/Navigation";
import Container from "@/components/Container";

interface Props {
	title?: string;
	bgColor?: string;
	bgGradient?: Gradient;
}

interface Gradient {
	color1?: string;
	color2?: string;
	position: 'to right'|'to bottom'|'to bottom right';
}

const PageBlock: Component<ParentProps<Props>> = (props) => {
	onMount(() => {if (props.title) document.title = props.title});

	return (
		<div class={'h-screen'} style={{ "background-image": props.bgGradient ? `linear-gradient(${props.bgGradient.position}, ${props.bgGradient.color1}, ${props.bgGradient.color2})` : 'none' }}>
			<Navigation/>
			<Container>
				{props.children}
			</Container>
		</div>
	)
};

export default PageBlock;
