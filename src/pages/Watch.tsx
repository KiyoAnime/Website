import {Component, createSignal, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo, {Anime} from "@/api/info";
import getEpisodes, {Episode} from "@/api/info/episodes";
import {createStore} from "solid-js/store";
import getStreams from "@/api/streams";
import {HiSolidFastForward, HiSolidRewind} from "solid-icons/hi";

const Watch: Component = () => {
	new Plyr('#player', {
		controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
	});
	const hls = new Hls();
	const { sId } = useParams();
	const [info, setInfo] = createSignal<Anime|undefined>();
	const [episode, setEpisode] = createSignal<number|undefined>();
	const [data, setData] = createStore<{ total: number; episodes?: Episode[]; }>({ total: 0 });

	onMount(async () => {
		await getInfo(parseInt(sId)).then((res) => setInfo(res.data));
		await getEpisodes(parseInt(sId)).then((res) => setData({ total: res.data.total, episodes: res.data.episodes }));
		if (!data.episodes) return;
		if (!Hls.isSupported()) return;
		await setEp(1, true);
	});

	const setEp = async (ep: number, first: boolean): Promise<void> => {
		setEpisode(ep);
		const player = document.getElementById('player') as HTMLMediaElement;
		console.log('function init');
		if (!data.episodes) return console.log('ep failed');
		await getStreams(data.episodes[ep-1].id).then(async (res) => {
			console.log('streams loaded');
			if (!player) return console.log('player failed');
			const stream = res.data.filter((s) => s.quality === '1080p' || s.quality === '720p' || s.quality == 'default')[0].url;
			console.log(stream);
			if (!stream) console.log('stream failed');
			await hls.loadSource(stream);
			console.log('source loaded');
			await hls.attachMedia(player);
			console.log('media attached');
			await hls.on(Hls.Events.MANIFEST_PARSED, () => {
				console.log('manifest parsed');
				if (first) player.play();
				else {
					player.currentTime = 0;
					player.play();
				}
			});
		});
	};

	return (
		<PageBlock title={'watch'}>
			<div class={'flex flex-col h-full'}>
				<h1 class={'mb-6'}>{info()?.title} | Ep: {episode()}</h1>
				<video id={'player'} class={'w-full max-w-6xl'} preload={'none'} controls/>
				<div class={'flex flex-col w-full max-w-6xl bg-secondary h-32'}>
					<div class={'flex justify-between h-8 bg-primary'}>
						<span/>
						<div class={'inline-flex px-3'}>
							<HiSolidRewind size={28} onClick={() => setEp(episode()!-1, false)}/>&nbsp;
							<HiSolidFastForward size={28} onClick={async () => await setEp(episode()!+1, false)}/>
						</div>
					</div>
				</div>
			</div>

			{/*<div class={'flex justify-start items-start mt-4'}>*/}
			{/*	<div class={'flex flex-wrap justify-around mt-6 gap-x-2 gap-y-5 sm:justify-between'}>*/}
			{/*		<For each={data.episodes}>*/}
			{/*			{(episode) => (*/}
			{/*				<button class={`${current() == episode.number ? 'bg-[#6FB28F] text-[#232323]' : 'bg-[#3A6281]'} text-white rounded-md w-12 h-8 text-xl font-bold`} onClick={handleClick} ep-number={episode.number}>{episode.number}</button>*/}
			{/*			)}*/}
			{/*		</For>*/}
			{/*	</div>*/}
			{/*</div>*/}
		</PageBlock>
	);
};

export default Watch;
