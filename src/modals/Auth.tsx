import {Component, createEffect, createSignal, JSX, Match, onMount, Show, Switch} from "solid-js";
import Modal from "@/components/Modal";
import check from "@/api/auth/check";
import {clearFlash, setFlash} from "@/components/Flash";
import Input from "@/components/Input";
import register from "@/api/auth/register";
import {emailRegex, httpToHuman} from "@/helpers";
import login from "@/api/auth/login";
import cookie from 'js-cookie';
import HCaptcha from "solid-hcaptcha";
import Form, {Value} from "@/components/Form";
import classNames from "classnames";

interface UserInfo {
	email?: string;
	username?: string;
	password?: string;
	passwordConf?: string;
}

const Auth: Component<{ open: boolean }> = (props)=> {
	const [view, setView] = createSignal('check');
	const [email, setEmail] = createSignal('');
	const [info, setInfo] = createSignal<UserInfo>();
	const [text, setText] = createSignal('Next');
	const [style, setStyle] = createSignal('h-80');
	const [title, setTitle] = createSignal('Welcome Back');
	const [loading, setLoading] = createSignal(false);
	const [exists, setExists] = createSignal<boolean|undefined>();

	const reset = () => {
		clearFlash();
		setView('check');
		setExists(undefined);
	};

	const submit = () => {
		setLoading(true);
		if (exists()) return loginFn();
		if (typeof exists() !== 'boolean' && !exists()) return checkFn();
		if (typeof exists() === 'boolean' && !exists()) return registerFn();
	};

	const checkSubmit = (values: Value) => {
		console.log('activated check');
		console.log(values.email);
		if (!values.email.match(emailRegex)) {
			setFlash({ type: 'warn', key: 'auth', message: 'Invalid email specified.' });
			return setLoading(false);
		}
		clearFlash();
		setEmail(values.email);
		check(values.email).then((res) => {
			if (res.data) {
				setStyle('h-[28rem]');
				setView('login');
			} else {
				setView('register');
				setStyle('h-[34.5rem]');
				setTitle('Create an Account');
			}
			return setLoading(false);
		});
	};

	const loginSubmit = (values: Value) => {

	};

	const registerSubmit = (values: Value) => {

	};

	const checkFn = () => {
		// console.log('test');
		// if (!info()?.email) {
		// 	inputError('email');
		// 	return setLoading(false);
		// }
		// clearFlash();
		// check(info()?.email!).then((res) => {
		// 	if (res.data) {
		// 		setExists(true);
		// 		setText('Login');
		// 		setStyle('h-[28rem]');
		// 	} else {
		// 		setStyle('h-[28rem]');
		// 		setExists(false);
		// 		setText('Create');
		// 		setTitle('Create an Account');
		// 	}
		// 	return setLoading(false);
		// });
	};

	const loginFn = () => {
		if (!info()?.password) {
			inputError('password');
			return setLoading(false);
		}
		clearFlash();
		login(info()?.email!, info()?.password!).then((res) => {
			cookie.set(res.data.key, res.data.value);
			return window.location.reload();
		}).catch((err) => {
			setFlash({ type: 'warn', key: 'auth', message: httpToHuman(err) });
			return setLoading(false);
		})
	};

	const registerFn = () => {
		if (!info()?.username) {
			inputError('username');
			return setLoading(false);
		}
		if (!info()?.password) {
			inputError('password');
			return setLoading(false);
		}
		if (!info()?.passwordConf) {
			inputError('passwordConf');
			return setLoading(false);
		}
		if (info()!.password !== info()!.passwordConf) {
			setFlash({ type: 'warn', key: 'auth', message: 'Passwords do not match.' });
			return setLoading(false);
		}
		clearFlash();
		register(info()?.email!, info()?.username!, info()?.password!).then((res) => {
			if (!res.error) window.location.reload();
		}).catch((res) => {
			setFlash({ type: 'error', key: 'auth', message: httpToHuman(res) });
			setLoading(false);
		});
	};

	const inputUpdate = (id: string) => (event: Event): void => {
		event.preventDefault();
		const value = (event.currentTarget as HTMLInputElement).value;
		setInfo({ ...info(), [id]: value });
		if (value) {
			const target = (event.currentTarget as HTMLInputElement);
			target.classList.add('border-accent-blue');
			target.classList.remove('border-red-600', 'focus:border-red-400');
		}
	};

	const inputError = (id: string): void => {
		const element = document.getElementById(id);
		console.log(element);
		if (!element) return;
		element.classList.add('border-red-600', 'focus:border-red-400');
		element.classList.remove('border-accent-blue');
	};

	return (
		<Modal key={'auth'} open={props.open} title={title()} style={classNames(style(), 'w-80 sm:w-[22rem] bg-primary')} resetFn={reset}>
			<div class={'flex flex-col justify-center mt-6'}>
				<Switch>
					<Match when={view() === 'check'} keyed={false}>
						<Form items={[{ id: 'email', type: 'email', label: 'Email' }]} color={'bg-primary'} submitting={false} onSubmit={checkSubmit} button={{ label: 'Next', color: 'blue' }}/>
					</Match>
					<Match when={view() === 'login'} keyed={false}>
						<Form items={[
							{ id: 'email', type: 'email', label: 'Email', value: email() },
							{ id: 'password', type: 'password', label: 'Password' }
						]} color={'bg-primary'} submitting={false} onSubmit={loginSubmit} button={{ label: 'Login', color: 'blue' }}>
							<span class={'flex justify-end mt-1'}>
								<span class={'cursor-pointer hover:text-accent-blue'}>Forgot Password?</span>
							</span>
							<div class={'mt-4'}>
								<HCaptcha id={'captcha'} sitekey={'cc87a83a-6974-4b66-93ba-08c9b0e1c1ac'} theme={'dark'}/>
							</div>
						</Form>
					</Match>
					<Match when={view() === 'register'} keyed={false}>
						<Form items={[
							{ id: 'email', type: 'email', label: 'Email', value: email() },
							{ id: 'username', type: 'text', label: 'Username' },
							{ id: 'password', type: 'password', label: 'Password' },
							{ id: 'passwordConf', type: 'password', label: 'Confirm Password' }
						]} color={'bg-primary'} submitting={false} onSubmit={registerSubmit} button={{ label: 'Create', color: 'blue' }}>
							<div class={'mt-5'}>
								<HCaptcha sitekey={'cc87a83a-6974-4b66-93ba-08c9b0e1c1ac'} theme={'dark'}/>
							</div>
						</Form>
					</Match>
				</Switch>
			</div>
		</Modal>
	);
};

export default Auth;
