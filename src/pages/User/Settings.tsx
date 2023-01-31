import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import { bolt, cog_8Tooth, informationCircle, lockClosed, play, userCircle } from "solid-heroicons/outline";
import Header from "@/components/Header";
import Box from "@/components/Box";
import Form, { Value } from "@/components/Form";
import store from "@/store";
import update, {updatePlayer} from "@/api/user/update";
import Flash, {setFlash} from "@/components/Flash";
import {autoClearFlash, httpToHuman} from "@/helpers";
import Btn from "@/components/Button";
import cookie from 'js-cookie';
import TabNavigation from "@/components/TabNavigation";

const Settings: Component = () => {
	const boxStyles = 'h-[20.7rem]';
	const infoOpt = 'flex justify-between items-center';
	const [infoSub, setInfoSub] = createSignal(false);
	const [passSub, setPassSub] = createSignal(false);
	const [playerSub, setPlayerSub] = createSignal(false);
	const [anilistSubmitting, setAnilistSubmitting] = createSignal(false);

	const infoSubmit = (values: Value) => {
		setInfoSub(true);
		update({ email: values.email, avatar: values.avatar, profileName: values.profileName }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated user information.' });
			setInfoSub(false);
			autoClearFlash();
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setInfoSub(false);
		});
	};

	const settingsSubmit = (values: Value) => {

	};

	const playerSubmit = (values: Value) => {
		setPlayerSub(true);
		updatePlayer({ autoNext: values.autoNext, autoSkip: values.autoSkip }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated player settings.' });
			setPlayerSub(false);
			autoClearFlash();
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setPlayerSub(false);
		})
	};

	const passSubmit = (values: Value) => {
		setPassSub(true);
	};

	const setAnilistToken = (change: boolean) => {
		var token = (document.getElementById('anilistToken') as HTMLInputElement).value
		if (!token) return;
		if (change) cookie.set('anilistToken', token, { expires: 365 });
		else cookie.remove('anilistToken');
	};

	return (
		<PageBlock title={'Settings'}>
			<TabNavigation tabs={[
				{ key: 'settings', label: 'Settings', icon: cog_8Tooth },
				{ key: 'profile', label: 'Profile', icon: userCircle }
			]} base={'user'}/>
			<Header icon={cog_8Tooth} title={'Settings'} description={'View or change your account information and settings.'} class={'mt-4'}/>
			<Flash key={'account'} type={'flex'}/>
			<div class={'grid grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
				<Box icon={informationCircle} title={'User Information'} class={boxStyles}>
					<Form onSubmit={infoSubmit} submitting={infoSub()} button={{ color: 'blue', label: 'Update' }} items={[
						{ id: 'profileName', type: 'text', label: 'Profile Name', value: store.user?.profileName, validation: { type: 'string', message: 'You must specify a profile name.' } },
						{ id: 'avatar', type: 'text', label: 'Avatar URL', value: store.user?.avatar, validation: { type: 'string', message: 'You must specify an avatar url.' } },
						{ id: 'email', type: 'text', label: 'Email', value: store.user?.email, validation: { type: 'string', message: 'You must specify an email.' } }
					]}/>
				</Box>
				<Box icon={cog_8Tooth} title={'General Settings'} class={boxStyles}>
					<Btn.Blue type={'button'} url='https://anilist.co/api/v2/oauth/authorize?client_id=11081&response_type=token'>Get AniList Token</Btn.Blue>
						<Form onSubmit={cookie.get('anilistToken') !== undefined ? () => setAnilistToken(false) : () => setAnilistToken(true)} submitting={anilistSubmitting()} button={ !cookie.get('anilistToken') ? { color: 'blue', label: 'Connect'} : { color: 'red', label: 'Disconnect' }} items={[
							{ id: 'anilistToken', type: 'text', label: 'AniList Token', validation: { type: 'string', message: 'You must specify an AniList token.' }, value: cookie.get('anilistToken') !== undefined ? cookie.get('anilistToken') : '' }
						]}>
					</Form>
				</Box>
				<Box icon={play} title={'Player Settings'} class={`${boxStyles} relative`}>
					<Form items={[
						{ id: 'autoSkip', type: 'checkbox', label: 'Auto Skip Intro', value: store.config?.autoSkip },
						{ id: 'autoNext', type: 'checkbox', label: 'Auto Next Episode', value: store.config?.autoNext },
					]} submitting={playerSub()} onSubmit={playerSubmit}>
						<div class={'absolute bottom-4 right-4'}>
							<Btn.Blue type={'submit'} loading={playerSub()}>Update</Btn.Blue>
						</div>
					</Form>
				</Box>
				<Box icon={lockClosed} title={'Change Password'} class={boxStyles}>
					<Form onSubmit={passSubmit} submitting={passSub()} button={{ color: 'red', label: 'Change' }} items={[
						{ id: 'old', type: 'password', label: 'Current' },
						{ id: 'new', type: 'password', label: 'New' },
						{ id: 'confirm', type: 'password', label: 'Confirm New' }
					]}/>
				</Box>
				<Box icon={bolt} title={'Advanced'} class={boxStyles}>
					<div class={'flex flex-col py-1 px-2 gap-y-2'}>
						<span class={infoOpt}>Profile Name:<code>{store.user?.profileName}</code></span>
						<span class={infoOpt}>Username:<code>{store.user?.username}</code></span>
						<span class={infoOpt}>User ID:<code>{store.user?._id}</code></span>
					</div>
				</Box>

			</div>
		</PageBlock>
	);
};

export default Settings;
