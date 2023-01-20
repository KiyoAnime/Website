import {Component, createSignal, JSX, Match, ParentProps, Show, Switch} from "solid-js";
import Container from "@/components/Container";
import store from "@/store";
import Btn from "@/components/Button";
import {A} from "@solidjs/router";
import Search from "@/elements/Search";
import {Icon} from "solid-heroicons";
import {arrowRightOnRectangle, bars_3, cog_8Tooth, userCircle} from "solid-heroicons/outline";
import {user} from "solid-heroicons/solid";
import Auth from "@/modals/Auth";
import { IconI } from '@/types';
import cookie from "js-cookie";
import banner from '@/assets/banner.png';

interface ItemProps {
	icon: IconI;
	href: string;
	onClick?: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>;
}

const [auth, setAuth] = createSignal(false);
const [mobile, setMobile] = createSignal(false);
const [dropdown, setDropdown] = createSignal(false);

const toggle = () => {
	setAuth(false);
	setAuth(true);
};

const Brand: Component = () => <A href={'/'} class={'inline-flex items-center'}><img src={banner} alt={'Kiyo'} class={'h-[4.5rem] mt-0.5 -ml-4 mr-1.5'}/></A>;

const Item: Component<ParentProps<ItemProps>> = (props) => (
	<A href={props.href} onClick={props.onClick}>
		<div class={'inline-flex h-8 w-full py-1 items-center rounded md:h-9 hover:bg-tertiary hover:text-accent-blue'}>
			<Icon path={props.icon} class={'h-6 w-6 mr-2 md:h-7 md:w-7'}/>
			<span class={'text-lg md:text-xl'}>{props.children}</span>
		</div>
	</A>
);

const Dropdown: Component = () => {
	const logout = () => {
		cookie.remove('token');
		window.location.reload();
	};

	return (
		<div class={'absolute flex flex-col top-12 right-0 h-auto w-80 py-1 px-2 z-2 bg-secondary rounded-md'}>
			<div class={'mb-1 p-1'}>
				<h3 class={'text-accent-pink'}>{store.user?.profileName}</h3>
				<span class={'truncate'}>{store.user?.email}</span>
			</div>
			<div class={'flex flex-col gap-y-1'}>
				<Item icon={cog_8Tooth} href={'/user/account'} onClick={() => setDropdown(false)}>Account</Item>
				<Item icon={arrowRightOnRectangle} href={'#'} onClick={logout}>Logout</Item>
			</div>
		</div>
	);
};

const Bar: Component<ParentProps> = (props) => {
	return (
		<div class={'py-4'}>
			<div class={'hidden p-4 h-20 justify-between items-center z-2 bg-primary rounded-xl sm:flex'}>
				{props.children}
			</div>
			<div class={'flex flex-col h-20 z-2 bg-primary rounded-t-xl sm:hidden'}>
				<div class={'inline-flex px-4 py-2 justify-between items-center sm:py-3'}>
					<Brand/>
					<Icon path={bars_3} class={'h-8 w-8 cursor-pointer'} onClick={() => setMobile(!mobile())}/>
				</div>
				<Show when={mobile()} keyed={false}>
					<Mobile/>
				</Show>
			</div>
		</div>
	);
};

const Mobile: Component = () => (
	<div class={'flex flex-col w-full px-4 py-2 z-3 gap-y-1 bg-primary rounded-b-xl sm:hidden'}>
		<div class={'inline-flex justify-center items-center mb-3'}>
			<Switch>
				<Match when={!store.user} keyed={false}>
					<span class={'flex flex-col items-center'} onClick={() => { setMobile(false); toggle(); }}>
						<Icon path={user} class={'h-10 w-10 text-accent-blue'}/>
						Login
					</span>
				</Match>
				<Match when={!!store.user} keyed={false}>
					<div class={'flex justify-center items-center h-16 w-16 ml-4 p-[0.15rem] bg-gradient-to-br from-accent-pink to-accent-blue rounded-full'}>
						<img class={'h-9.5 w-9.5 rounded-full'} src={store.user?.avatar} alt={store.user?.username}/>
					</div>
					<h3 class={'ml-4'}>{store.user?.profileName}</h3>
				</Match>
			</Switch>
		</div>
		<div class={'mb-2'}>
			<Search mobile/>
		</div>
		<Item href={'/user/account'} icon={user}>Account</Item>
		<Item href={'/'} icon={user}>Login 2</Item>
	</div>
);

const Navigation: Component = () => {
	return (
		<Container>
			<Auth open={auth()}/>
			<Switch>
				<Match when={!store.user} keyed={false}>
					<Bar>
						<Brand/>
						<div class={'hidden items-center sm:inline-flex'}>
							<Search/>
							<Btn.Text onClick={toggle}>
								Login
							</Btn.Text>
						</div>
					</Bar>
				</Match>
				<Match when={!!store.user} keyed={false}>
					<Bar>
						<Brand/>
						<div class={'relative hidden items-center sm:inline-flex'}>
							<Search/>
							<div class={'flex justify-center items-center h-11 w-11 ml-4 p-[0.15rem] cursor-pointer bg-gradient-to-br from-accent-pink to-accent-blue rounded-full'} onClick={() => setDropdown(!dropdown())}>
								<img class={'h-9.5 w-9.5 rounded-full'} src={store.user?.avatar} alt={store.user?.username}/>
							</div>
							<Show when={dropdown()} keyed={false}>
								<Dropdown/>
							</Show>
						</div>
					</Bar>
				</Match>
			</Switch>
		</Container>
	);
};

export default Navigation;
