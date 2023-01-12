import {Component} from "solid-js";
import Input, {Props} from "@/components/Input";

const FormInput: Component<Props> = (props) => (
	<Input {...props} labelBg={'bg-secondary'}/>
);

export default FormInput;
