import {Component, createSignal, Match, ParentProps, Switch} from "solid-js";
import Container from "@/components/Container";
import store from "@/store";
import Btn from "@/components/Button";
import Login from "@/modals/Login";
import {useLocation} from "@solidjs/router";

const Brand: Component = () => <span class={'inline-flex items-center'}><img src={'https://cdn.discordapp.com/attachments/1056117951415193621/1057926704896679946/Template_logo_w_kiyo-chan_2.png'} alt={'Kiyo'} height={64} width={64} class={'-ml-3.5 mr-1.5'}/><h1>Kiyo</h1></span>;

const Bar: Component<ParentProps> = ({ children }) => (
	<div class={'flex p-4 my-4 h-20 justify-between items-center bg-slate-900 rounded-xl'}>
		{children}
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
						<div>

						</div>
						<div>
							<Btn.Text onClick={() => setLogin(!login())}>
								Login
							</Btn.Text>
							<Btn.Text>
								Register
							</Btn.Text>
						</div>
					</Bar>
				</Match>
				<Match when={!!store.user} keyed={false}>
					<Bar>
						<Brand/>
						<div>

						</div>
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
