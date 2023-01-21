import {Component, createSignal, lazy, ParentProps} from "solid-js";
import {Route, Routes} from "@solidjs/router";
import RestrictedRoute from "@/components/RestrictedRoute";
import store, {setStoreData} from "@/store";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import cookie from "js-cookie";
import user from "@/api/user/user";
import Hls from "hls.js";

import Home from "@/pages/Home";
import View from "@/pages/View";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import Profile from "@/pages/Profile";

const Settings = lazy(() => import('@/pages/User/Settings'));

declare global {
	interface Window { hls: Hls }
}

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
			<Route path={'/view/:id'} component={View}/>
			<Route path={'/watch/:id'} component={Watch}/>
			<Route path={'/search/:query'} component={Search}/>

			<Route path={'/profile/:user'} element={<Profile/>}/>

			<Route path={'/user/settings'} element={<RR><Settings/></RR>}/>
		</Routes>
	);
};

export default App;
