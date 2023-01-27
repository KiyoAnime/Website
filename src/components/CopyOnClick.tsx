import {Component, ParentProps} from "solid-js";

const CopyOnClick: Component<ParentProps<{ text: string; }>> = (props) => {

	const click = () => {
		navigator.clipboard.writeText(props.text).then(() => {});
	};

	return (
		<div class={'cursor-pointer'} onClick={click}>
			{props.children}
		</div>
	)
};

export default CopyOnClick;
