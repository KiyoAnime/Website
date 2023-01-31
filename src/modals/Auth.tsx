import {Component, createSignal, Match, Switch} from "solid-js";
import Modal from "@/components/Modal";
import check from "@/api/auth/check";
import {clearFlash, setFlash} from "@/components/Flash";
import register from "@/api/auth/register";
import {emailRegex} from "@/helpers";
import login from "@/api/auth/login";
import cookie from 'js-cookie';
import HCaptcha from "solid-hcaptcha";
import Form, {Value} from "@/components/Form";
import classNames from "classnames";
import banner from '@/assets/banner.png';
import {inputError} from "@/components/Form/Form";
import Btn from "@/components/Button";

const Auth: Component<{ open: boolean }> = (props)=> {
	const [email, setEmail] = createSignal('');
	const [view, setView] = createSignal('check');
	const [style, setStyle] = createSignal('h-80');
	const [captcha, setCaptcha] = createSignal(false);
	const [title, setTitle] = createSignal('Welcome Back');
	const [checkSubmitting, setCheckSubmitting] = createSignal(false);
	const [loginSubmitting, setLoginSubmitting] = createSignal(false);
	const [registerSubmitting, setRegisterSubmitting] = createSignal(false);

	const reset = () => {
		clearFlash();
		setStyle('h-80')
		setView('check');
	};

	const checkSubmit = (values: Value) => {
		setCheckSubmitting(true);
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
				setStyle('h-[36.5rem]');
				setTitle('Create an Account');
			}
			return setCheckSubmitting(false);
		});
	};

	const loginSubmit = (values: Value) => {
		if (!captcha()) return inputError({ id: 'email', message: 'You must submit the captcha.' });
		setLoginSubmitting(true);
		login(values.email, values.password).then((res) => {
			const exp = new Date();
			exp.setDate(exp.getDate() + 90);
			cookie.set(res.data.key, res.data.value, { expires: exp, secure: true, sameSite: 'Strict' });
			return window.location.reload();
		}).catch(() => {
			inputError({ id: 'password', message: 'Incorrect password provided.' });
			return setLoginSubmitting(false);
		});
	};

	const registerSubmit = (values: Value) => {
		if (!captcha()) return inputError({ id: 'email', message: 'You must submit the captcha.' });
		setRegisterSubmitting(true);
		if (values.password !== values.passwordConf) {
			inputError({ id: 'passwordConf', message: 'Passwords do not match.' });
			return setRegisterSubmitting(false);
		}
		register(values.email, values.username, values.password).then((res) => {
			if (!res.error) window.location.reload();
		}).catch((res) => {
			if (res.response.data.code !== 'ERR.DUPLICATE_ACCOUNT') return;
			if (res.response.data.data.includes('Email')) inputError({ id: 'email', message: 'Email is already taken.' });
			if (res.response.data.data.includes('Username')) inputError({ id: 'username', message: 'Username is already taken.' });
			setRegisterSubmitting(false);
		});
	};

	return (
		<Modal key={'auth'} open={props.open} title={title()} style={classNames(style(), 'w-80 sm:w-[22rem] bg-primary')} resetFn={reset} image={view() === 'check' ? { src: banner, alt: 'Kiyo', class: 'w-1/2 mt-2' } : undefined}>
			<div class={'flex flex-col justify-center mt-6'}>
				<Switch>
					<Match when={view() === 'check'} keyed={false}>
						<Form items={[{ id: 'email', type: 'email', label: 'Email', validation: { type: emailRegex, message: 'Please specify a valid email.' } }]} color={'bg-primary'} submitting={checkSubmitting()} onSubmit={checkSubmit}>
							<div class={'absolute bottom-6 right-6'}>
								<Btn.Blue type={'submit'} loading={checkSubmitting()}>Next</Btn.Blue>
							</div>
						</Form>
					</Match>
					<Match when={view() === 'login'} keyed={false}>
						<Form items={[
							{ id: 'email', type: 'email', label: 'Email', value: email(), readonly: true },
							{ id: 'password', type: 'password', label: 'Password', validation: { type: 'string', message: 'You must specify a password.' } }
						]} color={'bg-primary'} submitting={loginSubmitting()} onSubmit={loginSubmit}>
							<span class={'flex justify-end'}>
								<span class={'cursor-pointer hover:text-accent-blue'}>Forgot Password?</span>
							</span>
							<div class={'mt-3'}>
								<HCaptcha id={'captcha'} sitekey={'cc87a83a-6974-4b66-93ba-08c9b0e1c1ac'} theme={'dark'} onVerify={() => setCaptcha(true)}/>
							</div>
							<div class={'absolute bottom-6 right-6'}>
								<Btn.Blue type={'submit'} loading={loginSubmitting()}>Login</Btn.Blue>
							</div>
						</Form>
					</Match>
					<Match when={view() === 'register'} keyed={false}>
						<Form items={[
							{ id: 'email', type: 'email', label: 'Email', value: email(), readonly: true },
							{ id: 'username', type: 'text', label: 'Username', validation: { type: 'string', message: 'You must provide a username.' } },
							{ id: 'password', type: 'password', label: 'Password', validation: { type: 'string', message: 'You must provide a password' } },
							{ id: 'passwordConf', type: 'password', label: 'Confirm Password', validation: { type: 'string', message: 'You must confirm your password.' } }
						]} color={'bg-primary'} submitting={registerSubmitting()} onSubmit={registerSubmit}>
							<div class={'mt-5'}>
								<HCaptcha sitekey={'cc87a83a-6974-4b66-93ba-08c9b0e1c1ac'} theme={'dark'} onVerify={() => setCaptcha(true)}/>
							</div>
							<div class={'absolute bottom-6 right-6'}>
								<Btn.Blue type={'submit'} loading={registerSubmitting()}>Register</Btn.Blue>
							</div>
						</Form>
					</Match>
				</Switch>
			</div>
		</Modal>
	);
};

export default Auth;
