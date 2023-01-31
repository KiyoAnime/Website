import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import Header from "@/components/Header";
import {adjustmentsHorizontal, cog_8Tooth, paintBrush, pencilSquare, userCircle} from "solid-heroicons/outline";
import TabNavigation from "@/components/TabNavigation";
import Flash, {clearFlash, setFlash} from "@/components/Flash";
import Box from "@/components/Box";
import Form, {Value} from "@/components/Form";
import {Converter} from "showdown";
import store from "@/store";
import Btn from "@/components/Button";
import bio from "@/api/user/profile/bio";
import {autoClearFlash, httpToHuman} from "@/helpers";
import design from "@/api/user/profile/design";
import config from "@/api/user/profile/config";

const Profile: Component = () => {
	const boxStyles = 'h-[20.7rem]';
	const [bioSubmitting, setBioSubmitting] = createSignal(false);
	const [designSubmitting, setDesignSubmitting] = createSignal(false);
	const [configSubmitting, setConfigSubmitting] = createSignal(false);

	const bioSubmit = (values: Value) => {
		setBioSubmitting(true);
		bio({ bio: values.bio }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated profile bio.' });
			setBioSubmitting(false);
			autoClearFlash();
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
			autoClearFlash();
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
			autoClearFlash();
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setConfigSubmitting(false);
		});
	};

	return (
		<PageBlock title={'Profile'}>
			<TabNavigation tabs={[
				{ key: 'settings', label: 'Settings', icon: cog_8Tooth },
				{ key: 'profile', label: 'Profile', icon: userCircle }
			]} base={'user'}/>
			<Header icon={userCircle} title={'Profile'} description={'Customize your profiles appearance.'} class={'mt-4'}/>
			<Flash key={'profile'} type={'flex'}/>
			<div class={'grid grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
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
						{ id: 'publicProfile', type: 'checkbox', label: 'Public Profile', value: store.config?.publicProfile },
						{ id: 'publicEmail', type: 'checkbox', label: 'Show Email', value: store.config?.publicEmail }
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

export default Profile;
