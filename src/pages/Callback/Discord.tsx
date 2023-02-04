import {Component, createSignal} from "solid-js";
import Loader from "@/components/Loader";
import discord from "@/api/user/integrations/discord";
import cookie from "js-cookie";

const Discord: Component = () => {
	const [code, setCode] = createSignal<string|undefined>();

	if (location.search.includes('error=')) return location.href = '/';
	if (location.search.includes('code=')) setCode(Object.fromEntries(new URLSearchParams(location.search)).code);

	discord(code()!).then((res) => {
		if (res.data.type === 'LOGIN')  {
			const exp = new Date();
			exp.setDate(exp.getDate() + 90);
			cookie.set(res.data.cookie?.key!, res.data.cookie?.value!, { expires: exp, secure: true, sameSite: 'Strict' });
		}
		return location.href = '/';
	});

	return (<Loader/>);
};

export default Discord;
