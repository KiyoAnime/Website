import {Component, createSignal, For, Match, onMount, Show, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import { useParams } from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo, { Anime } from "@/api/info/info";
import { createStore } from "solid-js/store";
import getUrl from "@/api/watch";
import {Icon} from "solid-heroicons";
import {chevronRight, chevronLeft, square_3Stack_3d, calendar} from "solid-heroicons/outline";
import {backward, forward} from "solid-heroicons/solid";
import classNames from "classnames";

interface Embedded {
	url: string;
	enabled: boolean;
}

const Watch: Component = () => {
	const { sId } = useParams();
	const [loading, setLoading] = createSignal(true);
	const [info, setInfo] = createSignal<Anime | undefined>();
	const [episode, setEpisode] = createSignal<number | undefined>();
	const [embedded, setEmbedded] = createSignal<Embedded|undefined>();
	const [range, setRange] = createStore({ start: 0, end: 0, perPage: 60 });

	onMount(async () => {
		await getInfo(parseInt(sId), true).then((res) => {
			setInfo(res.data);
			document.title = `Watching: ${res.data.title} • Kiyo`;
			setRange({ start: res.data.episodes![0].number, end: range.perPage });
		});
		setLoading(false);
		await setEp(1, true);
	});

	const setEp = async (ep: number, first?: boolean): Promise<void> => {
		const player = document.getElementById('player') as HTMLVideoElement;
		if (!player) return;
		const source = player.getElementsByTagName('source')[0];
		if (!info()?.episodes) return;
		await getUrl(info()?.episodes![ep - 1].id!).then(async (res) => {
			setEpisode(ep);
			if (res.data.url) {
				const hls = new Hls({ maxBufferLength: 30, maxBufferSize: 5242880, maxMaxBufferLength: 30 });
				const plyr = new Plyr('#player', { controls: ['play-large', 'play', 'volume', 'progress', 'current-time', 'mute', 'settings', 'pip', 'airplay', 'fullscreen'] });
				console.log('m3u8')
				source.setAttribute('src', res.data.url);
				await hls.loadSource(res.data.url);
				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					plyr.play();
				});
				hls.attachMedia(player);
			} else {
				startEmbedded(res.data.embedded);
			}
		});
	};

	const startEmbedded = (url: string) => {
		setEmbedded({ url: url, enabled: true });
		console.log(embedded()?.url)
		const player = document.getElementById('embedded-player') as HTMLIFrameElement;
		if (!player) return;
		console.log('setting height');
		player.height = player.contentWindow?.document.body.scrollHeight.toString() || '648';
	};

	return (
		<PageBlock title={'Kiyo'} loading={loading()}>
			<div class={'flex flex-row justify-between mt-4'}>
				<div class={'flex flex-col h-full w-full max-w-6xl'}>
					<Switch>
						<Match when={embedded()?.enabled} keyed={false}>
							<iframe id={'embedded-player'} src={embedded()?.url} style={'overflow: hidden;'} height={'648'} width={'1152'} />
						</Match>
						<Match when={!embedded()?.enabled} keyed={false}>
							<video id={'player'} preload={'none'} poster={'https://media.tenor.com/64BYBgDG41QAAAAC/loading.gif'}>
								<source src={''} type={'application/x-mpegURL'}/>
							</video>
						</Match>
					</Switch>
					<Show when={info()?.episodes} keyed={false}>
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
