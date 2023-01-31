import {Component, createResource, createSignal, lazy, ParentProps} from "solid-js";
import {Route, RouteDataFuncArgs, Routes} from "@solidjs/router";
import RestrictedRoute from "@/components/RestrictedRoute";
import store, {setStoreConfig, setStoreUser} from "@/store";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import cookie from "js-cookie";
import user from "@/api/user/getUser";
import Hls from "hls.js";
import Plyr from "plyr";
import getInfo from "@/api/info/info";

import Home from "@/pages/Home";
import Watch from "@/pages/Watch";
import Browse from '@/pages/Browse';
import Profile from "@/pages/Profile";
import View from "@/pages/View/View";
import Order from "@/pages/View/Order";
import Advanced from "@/pages/View/Advanced";
import Description from "@/pages/View/Description";
import Integrations from "@/pages/User/Integrations";

const UserProfile = lazy(() => import('@/pages/User/Profile'));
const UserSettings = lazy(() => import('@/pages/User/Settings'));
const UserIntegrations = lazy(() => import('@/pages/User/Integrations'));

declare global {
	interface Window { hls: Hls, plyr: Plyr }
}

export const animeData = ({ params }: RouteDataFuncArgs) => {
	const [anime] = createResource(async () => {
		return await getInfo(parseInt(params.id), false).then((res) => res.data);
	});
	return anime;
};

const App: Component = () => {
	const [loading, setLoading] = createSignal(true);
	const RR: Component<ParentProps> = ({ children }) => (<RestrictedRoute loading={loading()}>{children}</RestrictedRoute>);

	dayjs.extend(advancedFormat);

	if (!store.user && loading() && cookie.get('token')) {
		user().then((res) => {
			setStoreUser(res.data);
			setStoreConfig(res.data.config);
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

			<Route path={'/view/:id'} component={View} data={animeData}>
				<Route path={'/'} component={Description}/>
				<Route path={'/order'} component={Order}/>
				<Route path={'/advanced'} component={Advanced}/>
			</Route>

			<Route path={'/profile/:user'} element={<Profile/>}/>

			<Route path={'/user'}>
				<Route path={'/settings'} element={<RR><UserSettings/></RR>}/>
				<Route path={'/profile'} element={<RR><UserProfile/></RR>}/>
				<Route path={'/integrations'} element={<RR><Integrations/></RR>}/>
			</Route>
		</Routes>
	);
};

export default App;
