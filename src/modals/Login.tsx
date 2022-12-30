import {Component, createSignal} from "solid-js";
import Modal from "@/components/Modal/Modal";
import {supabase} from "@/App";
import {clearFlash, setFlash} from "@/components/Flash";
import {setStoreData} from "@/store";
import {inspect} from "util";
import styles from '../components/Modal/style.module.css'

const Login: Component<{ open: boolean }> = (props) => {
	const inputClass = 'h-10 w-full p-2 bg-primary rounded-md outline-none';
	const [email, setEmail] = createSignal('');
	const [pass, setPass] = createSignal('');
	const [loading, setLoading] = createSignal(false);
	// const [visible, setVisible] = createSignal(true);

	const submit = async () => {
		clearFlash();
		setLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({ email: email(), password: pass() });
		if (error) {
			setFlash({ type: 'error', message: error.message });
			return setLoading(false);
		}
		const { data: userData, error: userErr } = await supabase.from('users').select();
		if (!userData) return setFlash({ type: 'error', message: 'An unknown error has occurred.' });
		setStoreData(userData[0]);
		return location.reload();
	};

	return (
		<Modal open={props.open} title={'Login'} style={'h-96 w-80'} btnText={'Login'} btnLoading={loading()} btnSubmit={submit}>
			<div class={'flex flex-col justify-center mt-6'}>
				<div>
					<span>Email</span>
					<div class={styles.rainbowGradient}>
						<input type={'email'} class={inputClass} onChange={({ currentTarget: { value } }) => setEmail(value)} required/>
					</div>
				</div>
				<div class={'mt-2'}>
					<span>Password</span>
					<input type={'password'} class={inputClass} onChange={({ currentTarget: { value } }) => setPass(value)} required/>
				</div>
			</div>
		</Modal>
	);
};

export default Login;
