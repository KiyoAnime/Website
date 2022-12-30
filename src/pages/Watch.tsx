import {Component, createSignal, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import plyr from 'plyr';
import Hls from "hls.js";
import getInfo, {Anime} from "@/api/info";
import getEpisodes, {Episode} from "@/api/info/episodes";
import {createStore} from "solid-js/store";
import getStreams, {Stream} from "@/api/streams";

const Watch: Component = () => {
	const { sId, epId } = useParams();
	const [info, setInfo] = createSignal<Anime|undefined>();
	const [streams, setStreams] = createSignal<Stream[]|undefined>();
	const [data, setData] = createStore<{ total: number; episodes?: Episode[]; }>({ total: 0 });

	onMount(async () => {
		await getInfo(parseInt(sId)).then((res) => setInfo(res.data));
		await getEpisodes(parseInt(sId)).then((res) => setData({ total: res.data.total, episodes: res.data.episodes }));
		if (!data.episodes) console.log('fuck you');
		const id = data.episodes![parseInt(epId)-1].id;
		await getStreams(id).then((res) => setStreams(res.data));
		if (!Hls.isSupported()) return;
		const player = document.getElementById('player-1') as HTMLMediaElement;
		if (!player) return;
		const hls = new Hls();
		hls.loadSource(streams()![0].url);
		hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
			const availQual = hls.levels.map((l) => l.height);

			const quality = {
				default: availQual[0],
				options: availQual,
				forced: true,
				onChange: (q: number) => changeQuality(q, hls)
			};

			new plyr(player, { quality });
		});
		hls.attachMedia(player);
	});

	const changeQuality = (q: number, hls: Hls) => {
		hls.levels.forEach((level, index) => {
			if (level.height !== q) return;
			hls.currentLevel = index;
		});
	};

	return (
		<PageBlock title={'watch'}>
			<div class={'flex flex-col'}>
				<h1>{info()?.title}</h1>
				<video id={'player-1'} class={'w-3/4'} controls/>
			</div>
		</PageBlock>
	);
};

export default Watch;
