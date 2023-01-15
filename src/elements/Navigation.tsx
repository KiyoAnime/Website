import {Component, createSignal, JSXElement, Match, ParentProps, Show, Switch} from "solid-js";
import Container from "@/components/Container";
import store from "@/store";
import Btn from "@/components/Button";
import {A} from "@solidjs/router";
import Search from "@/elements/Search";
import {Icon} from "solid-heroicons";
import {bars_3} from "solid-heroicons/outline";
import {user} from "solid-heroicons/solid";
import Auth from "@/modals/Auth";
import { IconI } from '@/types';

interface ItemProps {
	icon: IconI;
	href: string;
}

const Brand: Component = () => <A href={'/'} class={'inline-flex items-center'}><img src={'https://cdn.discordapp.com/attachments/1056117951415193621/1057926704896679946/Template_logo_w_kiyo-chan_2.png'} alt={'Kiyo'} height={64} width={64} class={'-ml-3.5 mr-1.5'}/><h1>Kiyo</h1></A>;

const Item: Component<ParentProps<ItemProps>> = (props) => (
	<A href={props.href}>
		<div class={'inline-flex h-8 w-full py-3 items-center bg-secondary rounded'}>
			<Icon path={props.icon} class={'h-6 w-6 mr-2'}/>
			<span class={'text-lg'}>{props.children}</span>
		</div>
	</A>
);

const Dropdown: Component = () => (
	<div class={'absolute top-12 right-0 h-auto w-32 bg-secondary rounded-md'}>
		test
	</div>
);

const Bar: Component<ParentProps> = (props) => {
	const [menu, setMenu] = createSignal(false);

	return (
		<div class={'py-4'}>
			<div class={'hidden p-4 h-20 justify-between items-center z-2 bg-primary rounded-xl sm:flex'}>
				{props.children}
			</div>
			<div class={'flex flex-col h-20 z-2 bg-primary rounded-t-xl sm:hidden'}>
				<div class={'inline-flex px-4 py-3 justify-between items-center'}>
					<Brand/>
					<Icon path={bars_3} class={'h-8 w-8 cursor-pointer'} onClick={() => setMenu(!menu())}/>
				</div>
				<Show when={menu()} keyed={false}>
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
					<span class={'flex flex-col items-center'}>
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
	const [auth, setAuth] = createSignal(false);
	const [dropdown, setDropdown] = createSignal(false);

	return (
		<Container>
			<Auth open={auth()}/>
			<Switch>
				<Match when={!store.user} keyed={false}>
					<Bar>
						<Brand/>
						<div class={'hidden items-center sm:inline-flex'}>
							<Search/>
							<Btn.Text onClick={() => setAuth(!auth())}>
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
							<div class={'flex justify-center items-center h-11 w-11 ml-4 p-[0.15rem] bg-gradient-to-br from-accent-pink to-accent-blue rounded-full'} onClick={() => setDropdown(!dropdown())}>
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
