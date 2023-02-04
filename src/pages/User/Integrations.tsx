import {Component, Match, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import TabNavigation from "@/components/TabNavigation";
import {cog_8Tooth, link, userCircle} from "solid-heroicons/outline";
import Header from "@/components/Header";
import Flash from "@/components/Flash";
import Box from "@/components/Box";
import discordIcon from '@/assets/icons/discord.svg';
import store from "@/store";
import Btn from "@/components/Button";
import {getUrl} from "@/api/integrations/discord";

const Integrations: Component = () => {
	const boxStyles = 'h-72';
	const discord = store.user?.integrations.discord;

	const discordRedirect = () => {
		getUrl().then((res) => {
			location.href = res.data;
		});
	};

	const discordDisconnect = () => {

	};

	return (
		<PageBlock title={'Integrations'}>
			<TabNavigation tabs={[
				{ key: 'settings', label: 'Settings', icon: cog_8Tooth },
				{ key: 'profile', label: 'Profile', icon: userCircle },
				{ key: 'integrations', label: 'Integrations', icon: link }
			]} base={'user'}/>
			<Header icon={link} title={'Integrations'} description={'Configure integrations for your Kiyo Account.'} class={'mt-4'}/>
			<Flash key={'integrations'} type={'flex'}/>
			<div class={'grid grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
				<Box icon={discordIcon} title={'Discord'} class={`${boxStyles} relative`} cClass={'py-3 px-4'}>
					<Switch>
						<Match when={!discord} keyed={false}>
							<span>Your Kiyo Account is not currently connected to Discord. Connect to Discord to access your Kiyo Account from our Discord server and enable Login with Discord.</span>
							<div class={'absolute bottom-4 right-4'}>
								<Btn.Blue onClick={discordRedirect}>Connect</Btn.Blue>
							</div>
						</Match>
						<Match when={discord} keyed={false}>
							<span>Currently connected to <strong>{discord?.tag}</strong> ({discord?.id}).</span>
							<div class={'absolute bottom-4 right-4'}>
								<Btn.Red onClick={discordDisconnect}>Disconnect</Btn.Red>
							</div>
						</Match>
					</Switch>
				</Box>
			</div>
		</PageBlock>
	);
};

export default Integrations;
