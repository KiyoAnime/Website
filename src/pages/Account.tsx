import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";

const Account: Component = () => {
	const [loading, setLoading] = createSignal(true);

	return (
		<PageBlock title={'Account • Kiyo'} loading={loading()}>

		</PageBlock>
	);
};

export default Account;
