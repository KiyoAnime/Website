import {Component, createSignal, For, Match, onMount, Show, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import { useParams } from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo, { Anime } from "@/api/info";
import getEpisodes, { Episode } from "@/api/info/episodes";
import { createStore } from "solid-js/store";
import getStreams from "@/api/streams";
import {Icon} from "solid-heroicons";
import {chevronRight, chevronLeft, square_3Stack_3d, calendar} from "solid-heroicons/outline";
import {backward, forward} from "solid-heroicons/solid";
import classNames from "classnames";

const Watch: Component = () => {
	const { sId } = useParams();
	const [loading, setLoading] = createSignal(true);
	const [info, setInfo] = createSignal<Anime | undefined>();
	const [episode, setEpisode] = createSignal<number | undefined>();
	const [range, setRange] = createStore({ start: 0, end: 0, perPage: 60 });
	const [data, setData] = createStore<{ total: number; episodes?: Episode[]; }>({ total: 0 });
	new Plyr('#player', { controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'] });

	onMount(async () => {
		await getInfo(parseInt(sId)).then((res) => {
			setInfo(res.data);
			document.title = `Watching: ${res.data.title} • Kiyo`;
		});
		await getEpisodes(parseInt(sId)).then((res) => {
			setData({ total: res.data.total, episodes: res.data.episodes });
			setRange({ start: res.data.episodes[0].number, end: range.perPage });
		});
		setLoading(false);
		const player = document.getElementById('player') as HTMLMediaElement;
		if (!player) return;
		if (!data.episodes) return;
		await setEp(1, true);
	});

	const setEp = async (ep: number, first?: boolean): Promise<void> => {
		setEpisode(ep);
		const hls = new Hls();
		const player = document.getElementById('player') as HTMLMediaElement;
		if (!data.episodes) return;
		await getStreams(data.episodes[ep - 1].id).then(async (res) => {
			const stream = res.data.filter((s) => s.quality === '1080p' || s.quality === '720p' || s.quality == 'default')[0].url;
			console.log(stream);
			player.src = stream;
			await hls.loadSource(stream);
			await hls.attachMedia(player);
			console.log('attached');
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				if (!first) player.currentTime = 0; player.play();
			});
		});
	};

	return (
		<PageBlock title={'Kiyo'} loading={loading()}>
			<div class={'flex flex-row justify-between mt-4'}>
				<div class={'flex flex-col h-full w-full max-w-6xl'}>
					<video id={'player'} class={'w-full max-w-6xl'} preload={'none'} controls/>
					<Show when={data.episodes} keyed={false}>
						<div class={'flex flex-col w-full max-w-6xl bg-secondary'}>
							<div class={'flex h-8 justify-between bg-primary'}>
								<span/>
								<div class={'inline-flex items-center mx-3'}>
									<Icon path={backward} class={'h-7 w-7 cursor-pointer'} onClick={() => setEp(episode()! - 1, false)}/>&nbsp;
									<Icon path={forward} class={'h-7 w-7 cursor-pointer'} onClick={() => setEp(episode()! + 1, false)}/>
								</div>
							</div>
							<div class={'inline-flex justify-between items-center w-full py-4'}>
								<div class={'md:w-1/12'}>
									<Switch>
										<Match when={range.end < range.perPage * 2} keyed={false}>
											<Icon path={chevronLeft} class={'h-14 w-14 text-gray-500 cursor-not-allowed'}/>
										</Match>
										<Match when={range.end >= range.perPage * 2} keyed={false}>
											<Icon path={chevronLeft} class={'h-14 w-14 cursor-pointer'} onClick={() => setRange({ start: range.start - range.perPage, end: range.end - range.perPage })}/>
										</Match>
									</Switch>
								</div>
								<div class={'flex flex-wrap justify-between gap-[4px] md:justify-start'}>
									<For each={data.episodes}>
										{(e) => (
											<Show when={e.number >= range.start && e.number <= range.end} keyed={false}>
												<button class={classNames('w-12 h-8 bg-cyan-700 text-gray-100 rounded', e.number === episode() && 'bg-accent-pink')} onClick={() => setEp(e.number)}>{e.number}</button>
											</Show>
										)}
									</For>
								</div>
								<div class={'md:w-1/12'}>
									<Switch>
										<Match when={range.end >= data.episodes!.length+1} keyed={false}>
											<Icon path={chevronRight} class={'h-14 w-14 text-gray-500 cursor-not-allowed'}/>
										</Match>
										<Match when={range.end < data.episodes!.length+1} keyed={false}>
											<Icon path={chevronRight} class={'h-14 w-14 cursor-pointer'} onClick={() => setRange({ ...data, start: range.start + range.perPage, end: range.end + range.perPage })}/>
										</Match>
									</Switch>
								</div>
							</div>
						</div>
					</Show>
				</div>
				<div class={'flex flex-col hidden items-end ml-4 xl:flex'}>
					<img src={info()?.thumbnail} alt={info()?.title} class={'h-80 rounded-lg'}/>
					<h3 class={'mt-2'}>{info()?.title}</h3>
					<span class={'inline-flex items-center'}>
						<Icon path={calendar} class={'h-4 w-4'}/>&nbsp;{info()?.released}&nbsp;
						<Icon path={square_3Stack_3d} class={'h-4 w-4'}/>&nbsp;Episode: {episode()}
					</span>
				</div>
			</div>
		</PageBlock>
	);
};

export default Watch;
