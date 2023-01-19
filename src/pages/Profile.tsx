import {Component, createSignal, Show} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {A, useParams} from "@solidjs/router";
const Profile: Component = () => {
    const { user } = useParams();
    const getUser = async () => {

    }
    return (
        <PageBlock title={`${user} • Kiyo •`}>
            <div class={'flex justify-center mt-12 md:justify-start sm:mt-10 md:mt-10'}>
                <div class={'flex flex flex-col items-center md:items-start'}>
                    <div class={'relative'}>
                        <img class={'h-60 w-60 rounded-full absolute top-64 left-4 border-8 border-background'} src={'https://cdn.discordapp.com/avatars/664133993347940384/3f5ba99f517ef7f2878e61b6125c9717.png?size=4096'} alt={'profile_picture'}/>
                        <img  class={'w-screen h-96 rounded-2xl mt-4'} src={'https://cdn.discordapp.com/banners/664133993347940384/33966eadf3bbbc4b40a70e31b26beae4?size=4096'} alt={'banner'}/>
                        <h1 class={'text-4xl font-bold mt-4 ml-64'}>{user}</h1>
                    </div>
                </div>
            </div>
        </PageBlock>
    )
};

export default Profile;
