import {Component, createEffect, createSignal, For, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import plyr from 'plyr';
import Hls from "hls.js";
import getInfo, {Anime} from "@/api/info";
import getEpisodes, {Episode} from "@/api/info/episodes";
import {createStore} from "solid-js/store";
import getStreams, {Stream} from "@/api/streams";

const Watch: Component = () => {
	let currentEP = 0;
	const { sId } = useParams();
	const [info, setInfo] = createSignal<Anime|undefined>();
	const [streams, setStreams] = createSignal<Stream[]|undefined>();
	const [data, setData] = createStore<{ total: number; episodes?: Episode[]; }>({ total: 0 });
	const [current, setCurrent] = createSignal(1);
	const [quality, setQuality] = createSignal('');
	onMount(async () => {
		await getInfo(parseInt(sId)).then((res) => setInfo(res.data));
		await getEpisodes(parseInt(sId)).then((res) => setData({ total: res.data.total, episodes: res.data.episodes }));
		if (!data.episodes) console.log('fuck you');
		// @ts-ignore
		await getStreams(data.episodes[currentEP].id).then((res) => setStreams(res.data));
		if (!Hls.isSupported()) return;
		const player = document.getElementById('player') as HTMLMediaElement;
		if (!player) return;
		const hls = new Hls();
		const stream = streams()!.find((stream) => stream.quality === "1080p");
		if (!stream) return;
		await setQuality(stream.quality);
		hls.loadSource(stream!.url);
		createEffect(() => {
			hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
				new plyr(player);
			});
		});
		hls.attachMedia(player);
	});

	const changeQuality = (q: number, hls: Hls) => {
		hls.levels.forEach((level, index) => {
			if (level.height !== q) return;
			hls.currentLevel = index;
		});
	};
	const handleClick = async function (e: any) {
		currentEP = e.target.getAttribute("ep-number") as number;
		setCurrent(currentEP);
		const meow = await getStreams(data.episodes![currentEP-1].id).then((res) => setStreams(res.data));
		const player = document.getElementById('player') as HTMLMediaElement;
		if (!player) return;
		const hls = new Hls();
		const stream = quality() === '1080p' ? streams()!.find((stream) => stream.quality === "1080p") : streams()!.find((stream) => stream.quality === "720p");
		hls.loadSource(stream!.url);
		createEffect(() => {
			hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
				new plyr(player);
			});
		});
		hls.attachMedia(player);
	};

	return (
		<PageBlock title={'watch'}>
			<div class={'flex flex-col'}>
				<h1 class={'mb-4'}>{info()?.title}</h1>
				<video id={'player'} class={'w-3/4'} controls style={{'max-height': 'calc(100vh - 200px)'}}></video>
			</div>

			<div class={'flex justify-start items-start mt-4'}>
				<div class={'flex flex-wrap justify-around mt-6 gap-x-2 gap-y-5 sm:justify-between'}>
					<For each={data.episodes}>
						{(episode) => (
							<button class={`${current() == episode.number ? 'bg-[#6FB28F] text-[#232323]' : 'bg-[#3A6281]'} text-white rounded-md w-12 h-8 text-xl font-bold`} onClick={handleClick} ep-number={episode.number}>{episode.number}</button>
						)}
					</For>
				</div>
			</div>
		</PageBlock>
	);
};

export default Watch;
