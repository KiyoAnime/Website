import {Component, createSignal, For, Match, onMount, Show, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo, { Anime } from "@/api/info/info";
import { createStore } from "solid-js/store";
import getUrl from "@/api/watch";
import {Icon} from "solid-heroicons";
import {chevronRight, chevronLeft, square_3Stack_3d, calendar} from "solid-heroicons/outline";
import {backward, forward} from "solid-heroicons/solid";
import classNames from "classnames";
import store from "@/store";
import {setFlash} from "@/components/Flash";
import '@/styles/watch.module.css';

const Watch: Component = () => {
	const { id } = useParams();
	const [loading, setLoading] = createSignal(true);
	const [embedded, setEmbedded] = createSignal('');
	const [playerMode, setPlayerMode] = createSignal('kiyo');
	const [info, setInfo] = createSignal<Anime | undefined>();
	const [episode, setEpisode] = createSignal<number | undefined>();
	const [range, setRange] = createStore({ start: 0, end: 0, perPage: 60 });

	onMount(async () => {
		await getInfo(parseInt(id), true).then((res) => {
			setInfo(res.data);
			document.title = `Watching: ${res.data.title} • Kiyo`;
			setRange({ start: res.data.episodes![0].number, end: range.perPage });
		});
		setLoading(false);
		await setEp(1);
	});

	const setEp = async (ep: number): Promise<void> => {
		if (!store.user) return setFlash({ type: 'info', key: 'watch', message: 'You must sign up or login to Kiyo to use our services.' });
		if (!info()?.episodes) return;
		await getUrl(info()?.episodes![ep - 1].id!).then(async (res) => {
			setEpisode(ep);
			setEmbedded(res.data.embedded);
			if (!res.data.url) return setPlayerMode('embedded');
			const player = document.getElementById('player') as HTMLVideoElement;
			if (!player) return;
			if (player.canPlayType('application/vnd.apple.mpegurl')) return player.src = res.data.url;
			if (!Hls.isSupported()) return setPlayerMode('embedded');
			window.hls = new Hls({maxBufferLength: 30, maxBufferSize: 5242880, maxMaxBufferLength: 30});
			window.hls.loadSource(res.data.url);
			window.hls.on(Hls.Events.MANIFEST_PARSED, () => {
				const availableQualities = window.hls.levels.map((level) => level.height).reverse();
				const plyr = new Plyr('#player', {
					controls: ['play-large', 'play', 'volume', 'progress', 'current-time', 'mute', 'settings', 'pip', 'airplay', 'fullscreen'],
					quality: {
						forced: true,
						options: availableQualities,
						onChange: (e) => updateQuality(e),
						default: availableQualities.filter((q) => q === 1080 || q === 720)[0]
					}
				});
				plyr.play();
			});
			window.hls.attachMedia(player);
		})
	};

	const updateQuality = (quality: number) => {
		if (!window.hls) return;
		window.hls.levels.forEach((level, index) => {
			if (level.height === quality) {
				window.hls.currentLevel = index;
			}
		});
	}

	return (
		<PageBlock title={'Kiyo'} loading={loading()} flash={{ type: 'flex', key: 'watch' }}>
			<div class={'flex flex-col w-full mt-4 max-w-6xl'}>
				<Switch>
					<Match when={playerMode() === 'kiyo'} keyed={false}>
						<video id={'player'} autoplay controls poster={'https://media.tenor.com/64BYBgDG41QAAAAC/loading.gif'}/>
					</Match>
					<Match when={playerMode() === 'embedded'} keyed={false}>
						<div class={'h-[40.5rem]'}>
							{/* @ts-ignore: deprecated but solves problem. */}
							<iframe id={'embedded-player'} scrolling={'no'} allowfullscreen class={'h-full w-full overflow-hidden outline-none'}/>
						</div>
					</Match>
				</Switch>
				<Show when={info()?.episodes} keyed={false}>
					<div class={'flex flex-col w-full bg-secondary'}>
						<div class={'flex h-8 justify-between bg-primary'}>
							<span/>
							<div class={'inline-flex items-center mx-3'}>
								<Icon path={backward} class={'h-7 w-7 cursor-pointer'} onClick={() => setEp(episode()! - 1)}/>&nbsp;
								<Icon path={forward} class={'h-7 w-7 cursor-pointer'} onClick={() => setEp(episode()! + 1)}/>
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
								<For each={info()?.episodes}>
									{(e) => (
										<Show when={e.number >= range.start && e.number <= range.end} keyed={false}>
											<button class={classNames('w-12 h-8 bg-cyan-700 text-gray-100 rounded', e.number === episode() && 'bg-accent-pink')} onClick={() => setEp(e.number)}>{e.number}</button>
										</Show>
									)}
								</For>
							</div>
							<div class={'md:w-1/12'}>
								<Switch>
									<Match when={range.end >= info()!.episodes!.length+1} keyed={false}>
										<Icon path={chevronRight} class={'h-14 w-14 text-gray-500 cursor-not-allowed'}/>
									</Match>
									<Match when={range.end < info()!.episodes!.length+1} keyed={false}>
										<Icon path={chevronRight} class={'h-14 w-14 cursor-pointer'} onClick={() => setRange({ ...range, start: range.start + range.perPage, end: range.end + range.perPage })}/>
									</Match>
								</Switch>
							</div>
						</div>
					</div>
				</Show>
			</div>
		</PageBlock>
	);
};

export default Watch;
