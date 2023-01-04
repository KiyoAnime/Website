import {Component, createSignal, For, Match, onMount, Show, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import { useParams } from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo, { Anime } from "@/api/info";
import getEpisodes, { Episode } from "@/api/info/episodes";
import { createStore } from "solid-js/store";
import getUrl from "@/api/watch";
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
	const [windowHls, setWindowHls] = createSignal<Hls | undefined>();
	const defaultOptions = {
		controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
		quality: {
			default: 720,
			options: [144, 240, 360, 480, 720, 1080],
			forced: true,
			onChange: (e: any) => { }
		}
	};

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
		const hls = new Hls();
		hls.userConfig.maxMaxBufferLength = 30;
		hls.userConfig.maxBufferSize = 5 * 1024 * 1024;
		hls.userConfig.maxBufferLength = 30;
		setEpisode(ep);
		const player = document.getElementById('player');
		if (!player) return;
		const source = player.getElementsByTagName('source')[0];
		if (!data.episodes) return;
		await getUrl(data.episodes[ep - 1].source).then(async (res) => {
			source.setAttribute('src', res.data);
			await hls.loadSource(source.src);
			hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
				const availableQualities = hls.levels.map((level) => level.height).reverse();
				defaultOptions.quality = {
					default: availableQualities[3],
					options: availableQualities,
					forced: true,
					onChange: (e) => { updateQuality(e) }
				}
				const player = new Plyr('#player', defaultOptions);
			});
			hls.attachMedia(player as HTMLMediaElement);
			setWindowHls(hls);
		});

		const updateQuality = (newQuality: string | number) => {
			const hls = windowHls();
			if (!hls) return;
			hls.levels.forEach((level, levelIndex) => {
				if (level.height === newQuality) {
					console.log('Setting quality to ' + newQuality);
					hls.currentLevel = levelIndex;
				}
			});
		}
	};

	return (
		<PageBlock title={'Kiyo'} loading={loading()}>
			<div class={'flex flex-row justify-between mt-4'}>
				<div class={'flex flex-col h-full w-full max-w-6xl'}>
					<video id={'player'} class={'w-full max-w-6xl'} preload={'none'} controls>
						<source src='' type="application/x-mpegURL" />
					</video>
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