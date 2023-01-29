import {Component, Show, createResource, For} from "solid-js";
import {useRouteData} from "@solidjs/router";
import {animeData} from "@/App";
import {getOrder} from "@/api/info/info";
import Loader from "@/components/Loader";
import LongCard from "@/components/LongCard";

const Order: Component = () => {
	const info = useRouteData<typeof animeData>();

	const [order] = createResource(() => {
		return getOrder(info()?.id!).then((res) => res.data);
	});

	return (
		<Show when={!order.loading} keyed={false} fallback={<Loader/>}>
			<div class={'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'}>
				<For each={order()}>
					{(a) => (
						<LongCard {...a}/>
					)}
				</For>
			</div>
		</Show>
	);
};

export default Order;
