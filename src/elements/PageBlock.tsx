import {Component, createEffect, ParentProps, Show} from "solid-js";
import Navigation from "@/elements/Navigation";
import Container from "@/components/Container";
import Loader from "@/components/Loader";
import Flash from "@/components/Flash";

interface Props {
	title?: string;
	bgColor?: string;
	loading?: boolean;
	bgGradient?: Gradient;
	flash?: { key: string; type: 'flex'|'static'; };
}

interface Gradient {
	color1?: string;
	color2?: string;
	position: 'to top'|'to right'|'to bottom'|'to bottom right';
}

const PageBlock: Component<ParentProps<Props>> = (props) => {
	createEffect(() => {
		if (props.loading) return;
		if (props.title) document.title = `${props.title} • Kiyo`;
	}, [props.loading])

	return (
		<div class={'h-screen'} style={{ "background-image": props.bgGradient ? `linear-gradient(${props.bgGradient.position}, ${props.bgGradient.color1}, ${props.bgGradient.color2})` : 'none' }}>
			<Navigation/>
			<Show when={!props.loading} keyed={false} fallback={<Loader/>}>
				<Container>
					<Show when={props.flash} keyed={false}>
						<Flash key={props.flash!.key} type={props.flash!.type}/>
					</Show>
					{props.children}
				</Container>
			</Show>
		</div>
	)
};

export default PageBlock;
