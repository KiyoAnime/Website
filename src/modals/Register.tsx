import {Component, createSignal} from "solid-js";
import Modal from "@/components/Modal";

const Register: Component<{ open: boolean }> = (props) => {
	const [loading, setLoading] = createSignal(false);

	const submit = () => {

	};

	return (
		<Modal open={props.open} title={'Create an Account'} style={'h-auto w-80'} btnText={'Register'} btnLoading={loading()} btnSubmit={submit}>
			<div class={'flex flex-col justify-center mt-6'}>
				<div>
					<span>Username</span>
					<div class={'inline-flex items-center w-full p-0.5 bg-gradient-to-br from-accent-pink to-accent-blue rounded-xl'}>
						<input type={'text'} class={'w-full rounded-xl'}/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default Register;
