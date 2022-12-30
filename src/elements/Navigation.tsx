import {Component, createSignal, Match, ParentProps, Switch} from "solid-js";
import Container from "@/components/Container";
import store from "@/store";
import Btn from "@/components/Button";
import Login from "@/modals/Login";
import {A, useLocation} from "@solidjs/router";
import Search from "@/components/Search";

const Brand: Component = () => <A href={'/'} class={'inline-flex items-center'}><img src={'https://cdn.discordapp.com/attachments/1056117951415193621/1057926704896679946/Template_logo_w_kiyo-chan_2.png'} alt={'Kiyo'} height={64} width={64} class={'-ml-3.5 mr-1.5'}/><h1>Kiyo</h1></A>;

const Bar: Component<ParentProps> = ({ children }) => (
	<div class={'py-4'}>
		<div class={'flex p-4 h-20 justify-between items-center z-50 bg-primary rounded-xl'}>
			{children}
		</div>
	</div>
);

const Navigation: Component = () => {
	const location = useLocation();
	const [login, setLogin] = createSignal(false);

	return (
		<Container>
			<Login open={login()}/>
			<Switch>
				<Match when={!store.user} keyed={false}>
					<Bar>
						<Brand/>
						<div class={'inline-flex items-center'}>
							<Search/>
							<Btn.Text onClick={() => setLogin(!login())}>
								Login
							</Btn.Text>
						</div>
					</Bar>
				</Match>
				<Match when={!!store.user} keyed={false}>
					<Bar>
						<Brand/>
						<Search/>
						<div>
							{store.user?.name}
						</div>
					</Bar>
				</Match>
			</Switch>
		</Container>
	);
};

export default Navigation;
