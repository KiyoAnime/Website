import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {informationCircle, lockClosed, userCircle} from "solid-heroicons/outline";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import Box from "@/components/Box";
import Form, { Value } from "@/components/Form";
import store from "@/store";
import update from "@/api/user/update";
import Flash, {setFlash} from "@/components/Flash";
import {httpToHuman} from "@/helpers";

const Account: Component = () => {
	const boxClass = 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4';
	const [loading, setLoading] = createSignal(true);
	const [infoSubmitting, setInfoSubmitting] = createSignal(false);
	const [passSubmitting, setPassSubmitting] = createSignal(false);
	setLoading(false);

	const infoSubmit = (values: Value) => {
		setInfoSubmitting(true);
		update({ email: values.email, avatar: values.avatar, profileName: values.profileName }).then((res) => {
			if (!res.error) setFlash({ key: 'account', type: 'success', message: 'Successfully updated user information.' });
			setInfoSubmitting(false);
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
				{ key: 'account', title: 'Account', icon: userCircle },
				{ key: 'profile', title: 'Profile', icon: userCircle }
			]}/>
			<Header icon={userCircle} title={'Account'} description={'View or change your account information and settings.'} class={'mt-4'}/>
			<Flash key={'account'} type={'flex'}/>
			<div class={'flex justify-evenly'}>
				<Box icon={userCircle} title={'User Information'} class={boxClass}>
					<Form onSubmit={infoSubmit} submitting={infoSubmitting()} button={{ color: 'blue', label: 'Update' }} items={[
						{ id: 'profileName', type: 'text', label: 'Profile Name', value: store.user?.profileName },
						{ id: 'avatar', type: 'text', label: 'Avatar', value: store.user?.avatar },
						{ id: 'email', type: 'text', label: 'Email', value: store.user?.email }
					]}/>
				</Box>
				<Box icon={lockClosed} title={'Change Password'} class={boxClass}>
					<Form onSubmit={passSubmit} submitting={passSubmitting()} button={{ color: 'red', label: 'Change' }} items={[
						{ id: 'old', type: 'password', label: 'Current' },
						{ id: 'new', type: 'password', label: 'New' },
						{ id: 'confirm', type: 'password', label: 'Confirm New' }
					]}/>
				</Box>
			</div>
		</PageBlock>
	);
};

export default Account;
