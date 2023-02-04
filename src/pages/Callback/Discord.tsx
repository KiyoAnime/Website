import {Component, createSignal} from "solid-js";
import Loader from "@/components/Loader";
import discord from "@/api/integrations/discord";
import cookie from "js-cookie";
import PageBlock from "@/elements/PageBlock";
import {setFlash} from "@/components/Flash";
import {httpToHuman} from "@/helpers";

const Discord: Component = () => {
	const [code, setCode] = createSignal<string|undefined>();

	if (location.search.includes('error=')) return location.href = '/';
	if (location.search.includes('code=')) setCode(Object.fromEntries(new URLSearchParams(location.search)).code);

	discord(code()!).then(async (res) => {
		if (res.data.type === 'LOGIN')  {
			const exp = new Date();
			exp.setDate(exp.getDate() + 90);
			await cookie.set(res.data.cookie?.key!, res.data.cookie?.value!, { expires: exp, secure: true, sameSite: 'Strict' });
		}
		return location.href = '/';
	}).catch((err) => setFlash({ key: 'callback-discord', type: 'warn', message: httpToHuman(err) }));

	setTimeout(() => {
		location.href = '/';
	}, 5000);

	return (
		<PageBlock title={'Discord Callback'} flash={{ type: 'flex', key: 'callback-discord' }}>
			<Loader/>
		</PageBlock>
	);
};

export default Discord;
