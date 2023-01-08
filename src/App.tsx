import {Component, createSignal, ParentProps} from "solid-js";
import {Route, Routes} from "@solidjs/router";
import RestrictedRoute from "@/components/RestrictedRoute";
import Home from "@/pages/Home";
import store, {setStoreData} from "@/store";
import View from "@/pages/View";
import Search from "@/pages/Search";
import Watch from "@/pages/Watch";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import cookie from "js-cookie";
import user from "@/api/user/user";

const App: Component = () => {
	const [loaded, setLoaded] = createSignal(false);
	const RR: Component<ParentProps> = ({ children }) => (<RestrictedRoute loaded={loaded()}>{children}</RestrictedRoute>);

	dayjs.extend(advancedFormat);

	if (!store.user && !loaded() && cookie.get('token')) {
		user().then((res) => {
			setStoreData(res.data);
			setLoaded(true);
		}).catch((err) => {
			if (err.response.status === 401) setLoaded(true);
		});
	}

	return (
		<Routes>
			<Route path={'/'} component={Home}/>
			<Route path={'/view/:id'} component={View}/>
			<Route path={'/search/:query'} component={Search}/>
			<Route path={'/watch/:sId'} component={Watch}/>
		</Routes>
	);
};

export default App;
