import {Component, ParentProps} from "solid-js";

const Container: Component<ParentProps> = ({ children }) => (
	<div class={'w-full mx-auto max-w-[96rem] px-4'}>
		{children}
	</div>
);

export default Container;
