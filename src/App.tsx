import {Component, createResource, createSignal, lazy, ParentProps} from "solid-js";
import {Route, RouteDataFuncArgs, Routes} from "@solidjs/router";
import RestrictedRoute from "@/components/RestrictedRoute";
import store, {setStoreData} from "@/store";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import cookie from "js-cookie";
import user from "@/api/user/user";
import Hls from "hls.js";

import Home from "@/pages/Home";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import Browse from '@/pages/Browse';
import Profile from "@/pages/Profile";
import Description from "@/pages/View/Description";
import getInfo from "@/api/info/info";
import View from "@/pages/View/View";
import Plyr from "plyr";

const Settings = lazy(() => import('@/pages/User/Settings'));

declare global {
	interface Window { hls: Hls, plyr: Plyr }
}

export const animeData = ({ params }: RouteDataFuncArgs) => {
	const [anime] = createResource(async () => {
		return await getInfo(parseInt(params.id), false, true).then((res) => res.data);
	});
	return anime;
};

const App: Component = () => {
	const [loading, setLoading] = createSignal(true);
	const RR: Component<ParentProps> = ({ children }) => (<RestrictedRoute loading={loading()}>{children}</RestrictedRoute>);

	dayjs.extend(advancedFormat);

	if (!store.user && loading() && cookie.get('token')) {
		user().then((res) => {
			setStoreData(res.data);
			setLoading(false);
		}).catch((err) => {
			if (err.response.status === 401) setLoading(false);
		});
	}

	return (
		<Routes>
			<Route path={'/'} component={Home}/>
			<Route path={'/browse'} component={Browse}/>
			<Route path={'/watch/:id'} component={Watch}/>
			<Route path={'/search/:query'} component={Search}/>


			<Route path={'/view/:id'} component={View} data={animeData}>
				<Route path={'/'} component={Description}/>
				<Route path={'/order'} element={<h1>Order</h1>}/>
			</Route>

			<Route path={'/profile/:user'} element={<Profile/>}/>

			<Route path={'/user/settings'} element={<RR><Settings/></RR>}/>
		</Routes>
	);
};

export default App;
