import {Component, createSignal} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {Icon} from "solid-heroicons";
import {informationCircle, userCircle} from "solid-heroicons/outline";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import Box from "@/components/Box";
import Form from "@/components/Form";
import store from "@/store";

const Account: Component = () => {
	const [loading, setLoading] = createSignal(true);

	setLoading(false);
	return (
		<PageBlock title={'Account • Kiyo'} loading={loading()}>
			<TabNavigation base={'user'} tabs={[
				{ key: 'account', title: 'Account', icon: userCircle },
				{ key: 'profile', title: 'Profile', icon: userCircle }
			]}/>
			<Header icon={userCircle} title={'Account'} description={'View or change your account information and settings.'} class={'mt-4'}/>
			<Box icon={userCircle} title={'User Information'} class={'w-1/4'}>
				<Form onSubmit={() => {}} submitting={false} items={[
					{ id: 'name', type: 'text', label: 'Profile Name' },
					{ id: 'email', type: 'text', label: 'Email', value: store.user?.email }
				]}/>
			</Box>
		</PageBlock>
	);
};

export default Account;
