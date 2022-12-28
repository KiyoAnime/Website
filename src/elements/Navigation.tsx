import {Component, createSignal, Match, ParentProps, Switch} from "solid-js";
import Container from "@/components/Container";
import store from "@/store";
import Btn from "@/components/Button";
import Login from "@/modals/Login";
import {useLocation} from "@solidjs/router";

const Brand: Component = () => <span><h2>Kiyo</h2></span>;

const Bar: Component<ParentProps> = ({ children }) => (
	<div class={'flex p-4 my-4 h-16 justify-between items-center bg-slate-900 rounded-xl'}>
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
