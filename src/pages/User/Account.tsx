import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {bolt, cog_8Tooth, informationCircle, lockClosed, userCircle} from "solid-heroicons/outline";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import Box from "@/components/Box";
import Form, { Value } from "@/components/Form";
import store from "@/store";
import update from "@/api/user/update";
import Flash, {clearFlash, setFlash} from "@/components/Flash";
import {httpToHuman} from "@/helpers";

const Account: Component = () => {
	const [loading, setLoading] = createSignal(true);
	const infoOpt = 'flex justify-between items-center';
	const [infoSubmitting, setInfoSubmitting] = createSignal(false);
	const [passSubmitting, setPassSubmitting] = createSignal(false);
	setLoading(false);

	const infoSubmit = (values: Value) => {
		setInfoSubmitting(true);
		update({ email: values.email, avatar: values.avatar, profileName: values.profileName }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated user information.' });
			setInfoSubmitting(false);
			setTimeout(() => {
				clearFlash();
			}, 5000)
		}).catch((err) => {
			setFlash({ key: 'account', type: 'warn', message: httpToHuman(err) });
			setInfoSubmitting(false);
		});
	};

	const passSubmit = (values: Value) => {

	};

	return (
		<PageBlock title={'Account • Kiyo'} loading={loading()}>
			<TabNavigation base={'user'} tabs={[
				{ key: 'account', title: 'Account', icon: cog_8Tooth },
				{ key: 'profile', title: 'Profile', icon: userCircle }
			]}/>
			<Header icon={userCircle} title={'Account'} description={'View or change your account information and settings.'} class={'mt-4'}/>
			<Flash key={'account'} type={'flex'}/>
			<div class={'grid grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
				<Box icon={informationCircle} title={'User Information'}>
					<Form onSubmit={infoSubmit} submitting={infoSubmitting()} button={{ color: 'blue', label: 'Update' }} items={[
						{ id: 'profileName', type: 'text', label: 'Profile Name', value: store.user?.profileName },
						{ id: 'avatar', type: 'text', label: 'Avatar URL', value: store.user?.avatar },
						{ id: 'email', type: 'text', label: 'Email', value: store.user?.email }
					]}/>
				</Box>
				<Box icon={cog_8Tooth} title={'Settings'}>

				</Box>
				<Box icon={lockClosed} title={'Change Password'}>
					<Form onSubmit={passSubmit} submitting={passSubmitting()} button={{ color: 'red', label: 'Change' }} items={[
						{ id: 'old', type: 'password', label: 'Current' },
						{ id: 'new', type: 'password', label: 'New' },
						{ id: 'confirm', type: 'password', label: 'Confirm New' }
					]}/>
				</Box>
				<Box icon={bolt} title={'Advanced'}>
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

export default Account;
