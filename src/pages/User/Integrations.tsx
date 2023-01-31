import {Component} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import TabNavigation from "@/components/TabNavigation";
import {cog_8Tooth, link, userCircle} from "solid-heroicons/outline";
import Header from "@/components/Header";
import Flash from "@/components/Flash";
import Box from "@/components/Box";
import discord from '@/assets/icons/discord.svg';

const Integrations: Component = () => {
	const boxStyles = 'h-[20.7rem]';

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
				<Box icon={discord} title={'Discord'} class={boxStyles}>

				</Box>
			</div>
		</PageBlock>
	);
};

export default Integrations;
