import {Component, createSignal, Match, Switch} from "solid-js";
import Modal from "@/components/Modal";
import check from "@/api/auth/check";
import {clearFlash, setFlash} from "@/components/Flash";
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
	const [checkSubmitting, setCheckSubmitting] = createSignal(false);
	const [loginSubmitting, setLoginSubmitting] = createSignal(false);
	const [registerSubmitting, setRegisterSubmitting] = createSignal(false);

	const reset = () => {
		clearFlash();
		setView('check');
	};

	const checkSubmit = (values: Value) => {
		setCheckSubmitting(true)
		if (!values.email.match(emailRegex)) {
			setFlash({ type: 'warn', key: 'auth', message: 'Invalid email specified.' });
			return setCheckSubmitting(false);
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
				setTitle('Create an Settings');
			}
			return setCheckSubmitting(false);
		});
	};

	const loginSubmit = (values: Value) => {
		setLoginSubmitting(true);
		login(values.email, values.password).then((res) => {
			cookie.set(res.data.key, res.data.value);
			return window.location.reload();
		}).catch((err) => {
			setFlash({ type: 'warn', key: 'auth', message: httpToHuman(err) });
			return setLoginSubmitting(false);
		});
	};

	const registerSubmit = (values: Value) => {
		setRegisterSubmitting(true);
		if (values.password !== values.passwordConf) {
			setFlash({ type: 'warn', key: 'auth', message: 'Passwords do not match.' });
			return setRegisterSubmitting(false);
		}
		clearFlash();
		register(values.email, values.username, values.password).then((res) => {
			if (!res.error) window.location.reload();
		}).catch((res) => {
			setFlash({ type: 'error', key: 'auth', message: httpToHuman(res) });
			setRegisterSubmitting(false);
		});
	};

	return (
		<Modal key={'auth'} open={props.open} title={title()} style={classNames(style(), 'w-80 sm:w-[22rem] bg-primary')} resetFn={reset}>
			<div class={'flex flex-col justify-center mt-6'}>
				<Switch>
					<Match when={view() === 'check'} keyed={false}>
						<Form items={[{ id: 'email', type: 'email', label: 'Email' }]} color={'bg-primary'} submitting={checkSubmitting()} onSubmit={checkSubmit} button={{ label: 'Next', color: 'blue' }}/>
					</Match>
					<Match when={view() === 'login'} keyed={false}>
						<Form items={[
							{ id: 'email', type: 'email', label: 'Email', value: email() },
							{ id: 'password', type: 'password', label: 'Password' }
						]} color={'bg-primary'} submitting={loginSubmitting()} onSubmit={loginSubmit} button={{ label: 'Login', color: 'blue' }}>
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
						]} color={'bg-primary'} submitting={registerSubmitting()} onSubmit={registerSubmit} button={{ color: 'blue', label: 'Create' }}>
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
