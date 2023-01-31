import {Component, createSignal, onMount, Show} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {A, useParams} from "@solidjs/router";
import profile, { ProfileResult } from "@/api/user/profile/getProfile";

const Profile: Component = () => {
    const { user } = useParams();
    const [userProfile, setUserProfile] = createSignal<ProfileResult|undefined>();
    onMount(() => {
        profile(user).then(async (res) => {
            setUserProfile(res.data);
        }).then(() => {
            const gradient = document.getElementById('gradient')
            if (gradient) {
                gradient.style.background = `linear-gradient(160deg, ${userProfile()?.profile.gradient.start} 0%, ${userProfile()?.profile.gradient.end} 100%)`
            }
        })
    });
    return (
        <PageBlock title={user}>
            <div class={'flex justify-center mt-12 md:justify-start sm:mt-10 md:mt-10'}>
                <div class={'flex flex-col items-center md:items-start'}>
                    <div class={'relative'}>
                        <img class={'h-60 w-60 rounded-full absolute top-64 left-4 border-8 border-background'} src={userProfile()?.avatar} alt={'avatar'}/>
                        <div class={'p-4 h-96 w-[81.5vw] justify-between items-center z-2 bg-primary sm:flex rounded-2xl'} id={'gradient'}></div>
                        <h1 class={'text-4xl font-bold mt-4 ml-64'}>{userProfile()?.profileName}</h1>
                    </div>
                </div>
            </div>
        </PageBlock>
    )
};

export default Profile;
