import {Component, createSignal, ParentProps} from "solid-js";
import {createClient} from "@supabase/supabase-js";
import {Route, Routes} from "@solidjs/router";
import RestrictedRoute from "@/components/RestrictedRoute";
import Home from "@/pages/Home";
import {setStoreData} from "@/store";
import View from "@/pages/View";

export const supabase = createClient('https://uoolamthpyzpiqrbchee.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvb2xhbXRocHl6cGlxcmJjaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIxNDE4NzUsImV4cCI6MTk4NzcxNzg3NX0.Q_hoRdaysvhUI4n5BcMyOOB6qzzENoBP9gZ0pVht3rk');

export const getUser = async () => {
	const { data: { user } } = await supabase.auth.getUser();
	return user;
};

const App: Component = () => {
	const [loaded, setLoaded] = createSignal(false);
	const RR: Component<ParentProps> = ({ children }) => (<RestrictedRoute loaded={loaded()}>{children}</RestrictedRoute>);

	getUser().then(async (res) => {
		if (!res) return setLoaded(true);
		const { data, error } = await supabase.from('users').select();
		if (!data) return setLoaded(true);
		setStoreData(data[0]);
		setLoaded(true);
	});

	return (
		<Routes>
			<Route path={'/'} component={Home}/>
			<Route path={'/view/:id'} component={View}/>
		</Routes>
	);
};

export default App;
