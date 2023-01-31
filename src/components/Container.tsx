import {Component, createSignal, ParentProps} from "solid-js";
import classNames from "classnames";

type Size = 'medium'|'small';

interface Props {
	size?: Size;
	class?: string;
}

const Container: Component<ParentProps<Props>> = (props) => {
	const [size, setSize] = createSignal('max-w-[100rem]');

	if (props.size) switch (props.size) {
		case 'small':
			setSize('max-w-6xl');
			break;

		case 'medium':
			setSize('max-w-[84rem]');
			break;
	}

	return (
		<div class={classNames('w-full mx-auto px-4', props.class, size())}>
			{props.children}
		</div>
	);
}

export default Container;
