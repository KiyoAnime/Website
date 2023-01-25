import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {
	adjustmentsHorizontal,
	bolt,
	cog_8Tooth,
	informationCircle,
	lockClosed, paintBrush,
	pencilSquare,
	userCircle
} from "solid-heroicons/outline";
import Header from "@/components/Header";
import Box from "@/components/Box";
import Form, { Value } from "@/components/Form";
import store from "@/store";
import update from "@/api/user/update";
import Flash, {clearFlash, setFlash} from "@/components/Flash";
import {httpToHuman} from "@/helpers";
import Btn from "@/components/Button";
import config from "@/api/user/profile/config";
import bio from "@/api/user/profile/bio";
import design from "@/api/user/profile/design";
import {Converter} from "showdown";

const Settings: Component = () => {
	const boxStyles = 'h-[20.7rem]';
	const [loading, setLoading] = createSignal(true);
	const infoOpt = 'flex justify-between items-center';
	const [bioSubmitting, setBioSubmitting] = createSignal(false);
	const [infoSubmitting, setInfoSubmitting] = createSignal(false);
	const [passSubmitting, setPassSubmitting] = createSignal(false);
	const [designSubmitting, setDesignSubmitting] = createSignal(false);
	const [configSubmitting, setConfigSubmitting] = createSignal(false);
	setLoading(false);

	const infoSubmit = (values: Value) => {
		setInfoSubmitting(true);
		update({ email: values.email, avatar: values.avatar, profileName: values.profileName }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated user information.' });
			setInfoSubmitting(false);
			setTimeout(() => {
				clearFlash();
			}, 5000);
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setInfoSubmitting(false);
		});
	};

	const settingsSubmit = (values: Value) => {

	};

	const passSubmit = (values: Value) => {

	};

	const bioSubmit = (values: Value) => {
		setBioSubmitting(true);
		bio({ bio: values.bio }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated profile bio.' });
			setBioSubmitting(false);
			setTimeout(() => {
				clearFlash();
			}, 5000);
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setBioSubmitting(false);
		});
	};

	const designSubmit = (values: Value) => {
		setDesignSubmitting(true);
		design({ gradient: { end: values.end, start: values.start } }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated profile design.' });
			setDesignSubmitting(false);
			setTimeout(() => {
				clearFlash();
			}, 5000);
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setDesignSubmitting(false);
		});
	};

	const configSubmit = (values: Value) => {
		setConfigSubmitting(true);
		config({ publicEmail: values.publicEmail, publicProfile: values.publicProfile }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated profile config.' });
			setConfigSubmitting(false);
			setTimeout(() => {
				clearFlash();
			}, 5000);
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setConfigSubmitting(false);
		});
	};

	return (
		<PageBlock title={'Settings • Kiyo'} loading={loading()}>
			<Header icon={userCircle} title={'Settings'} description={'View or change your account information and settings.'} class={'mt-4'}/>
			<Flash key={'account'} type={'flex'}/>
			<div class={'grid grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
				<Box icon={informationCircle} title={'User Information'} class={boxStyles}>
					<Form onSubmit={infoSubmit} submitting={infoSubmitting()} button={{ color: 'blue', label: 'Update' }} items={[
						{ id: 'profileName', type: 'text', label: 'Profile Name', value: store.user?.profileName, validation: { type: 'string', message: 'You must specify a profile name.' } },
						{ id: 'avatar', type: 'text', label: 'Avatar URL', value: store.user?.avatar, validation: { type: 'string', message: 'You must specify an avatar url.' } },
						{ id: 'email', type: 'text', label: 'Email', value: store.user?.email, validation: { type: 'string', message: 'You must specify an email.' } }
					]}/>
				</Box>
				<Box icon={cog_8Tooth} title={'Settings'} class={boxStyles}>

				</Box>
				<Box icon={lockClosed} title={'Change Password'} class={boxStyles}>
					<Form onSubmit={passSubmit} submitting={passSubmitting()} button={{ color: 'red', label: 'Change' }} items={[
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
				<Box icon={pencilSquare} title={'Profile Bio'} class={`${boxStyles} relative md:col-span-2`}>
					<Form items={[
						{ id: 'bio', type: 'textarea', label: 'Text', value: new Converter().makeMarkdown(store.user?.profile.bio || '<strong>Make something cool...</strong>') }
					]} submitting={bioSubmitting()} onSubmit={bioSubmit}>
						<div class={'absolute bottom-4 right-4'}>
							<Btn.Blue type={'submit'} loading={bioSubmitting()}>Update</Btn.Blue>
						</div>
					</Form>
				</Box>
				<Box icon={paintBrush} title={'Profile Design'} class={`${boxStyles} relative`}>
					<h4 class={'pt-1 px-1.5'}>Gradient:</h4>
					<Form items={[
						{ id: 'start', type: 'color', label: 'Start', value: store.user?.profile.gradient.start },
						{ id: 'end', type: 'color', label: 'End', value: store.user?.profile.gradient.end }
					]} class={'grid grid-cols-2 gap-4'} submitting={designSubmitting()} onSubmit={designSubmit}>
						<div class={'absolute bottom-4 right-4'}>
							<Btn.Blue type={'submit'} loading={designSubmitting()}>Update</Btn.Blue>
						</div>
					</Form>
				</Box>
				<Box icon={adjustmentsHorizontal} title={'Profile Config'} class={`${boxStyles} relative`}>
					<Form items={[
						{ id: 'publicProfile', type: 'checkbox', label: 'Public Profile', value: store.user?.config.publicProfile },
						{ id: 'publicEmail', type: 'checkbox', label: 'Show Email', value: store.user?.config.publicEmail }
					]} submitting={configSubmitting()} onSubmit={configSubmit}>
						<div class={'absolute bottom-4 right-4'}>
							<Btn.Blue type={'submit'} loading={configSubmitting()}>Update</Btn.Blue>
						</div>
					</Form>
				</Box>
			</div>
		</PageBlock>
	);
};

export default Settings;
