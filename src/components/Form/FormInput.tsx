import {Component} from "solid-js";
import Input, {Props} from "@/components/Input";

interface FormInputProps extends Props {
	color?: string;
}

const FormInput: Component<FormInputProps> = (props) => (
	<Input {...props} labelBg={props.color ? props.color : 'bg-secondary'}/>
);

export default FormInput;
