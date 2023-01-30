import {Component, createEffect, createResource, createSignal, For, JSX, Match, ParentProps, Show, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo from "@/api/info/info";
import { createStore } from "solid-js/store";
import getUrl from "@/api/watch";
import {Icon} from "solid-heroicons";
import {chevronRight, chevronLeft, folderOpen} from "solid-heroicons/outline";
import {backward, forward} from "solid-heroicons/solid";
import classNames from "classnames";
import store from "@/store";
import {setFlash} from "@/components/Flash";
import Input from "@/components/Input";
import {httpToHuman} from "@/helpers";
import syncAnime from "@/api/sync";
import cookie from 'js-cookie';
// const Control: Component<ParentProps<{ onClick: JSX.EventHandlerUnion<HTMLButtonElement, Event> }>> = (props) => (
// 	<button class={'inline-flex items-center h-7 p-2 text-gray-200 bg-cyan-700 rounded'} onClick={props.onClick}>
// 		{props.children}
// 	</button>
// );

const Watch: Component = () => {
	const { id } = useParams();
	const [embedded, setEmbedded] = createSignal('');
	const [playerMode, setPlayerMode] = createSignal('kiyo');
	const [episode, setEpisode] = createSignal<number | undefined>();
	const [range, setRange] = createStore({ start: 0, end: 0, perPage: 88 });
	const [dub, setDub] = createSignal(false);
	const [paused, setPaused] = createSignal(false);

	const [info] = createResource(async () => {
		return getInfo(parseInt(id), true).then((res) => res.data);
	});

	createEffect(async () => {
		if (info.loading) return;
		document.title = `${info()?.title} • Kiyo`;
		setRange({ start: info()?.episodes![0].number, end: range.perPage });
		await setEp(1, false);
	}, [info.loading]);

	document.addEventListener('keydown', (e) => {
		if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
			e.preventDefault();
			if (playerMode() === 'kiyo') {
				window.plyr?.togglePlay();
				setPaused(!paused());
			} else {
				const player = document.getElementById('player') as HTMLVideoElement;
				if (player.paused) {
					player.play();
				} else {
					player.pause();
				}
			}
		}
	});

	const syncAnilist = async () => {
		if (!episode()?.toString()) return;
		if (episode()! !== range.end) await syncAnime(id, 'CURRENT', episode()!.toString(), cookie.get('anilistToken')!)
		else await syncAnime(id, 'COMPLETED', episode()!.toString(), cookie.get('anilistToken')!)
	};

	const setEp = async (ep: number, dub: boolean): Promise<void> => {
		if (!store.user) return setFlash({ type: 'info', key: 'watch', message: 'You must sign up or login to Kiyo to use our services.' });
		if (!info()?.episodes) return;
		await getUrl(info()?.episodes![ep - 1].id!, dub).then(async (res) => {
			setEpisode(ep);
			setEmbedded(res.data.embedded);
			document.title = `Episode ${ep} • ${info()?.title} • Kiyo`;
			if (!res.data.url) return setPlayerMode('embedded');
			const player = document.getElementById('player') as HTMLVideoElement;
			if (!player) return;
			setDub(dub);
			if (player.canPlayType('application/vnd.apple.mpegurl')) return player.src = res.data.url;
			if (!Hls.isSupported()) return setPlayerMode('embedded');
			window.hls = new Hls({maxBufferLength: 30, maxBufferSize: 5242880, maxMaxBufferLength: 30});
			window.hls.loadSource(res.data.url);
			window.hls.on(Hls.Events.MANIFEST_PARSED, () => {
				const availableQualities = window.hls.levels.map((level) => level.height).reverse();
				window.plyr = new Plyr('#player', {
					controls: ['play-large', 'play', 'volume', 'progress', 'current-time', 'mute', 'settings', 'pip', 'airplay', 'fullscreen'],
					quality: {
						forced: true,
						options: availableQualities,
						onChange: (e) => updateQuality(e),
						default: availableQualities.filter((q) => q === 1080 || q === 720)[0]
					}
				});
				window.plyr.play();
				syncAnilist();
			});
			window.hls.attachMedia(player);
			syncAnilist();
		}).catch((err) => {
			return setFlash({ type: 'warn', key: 'watch', message: httpToHuman(err) });
		});
	};

	const updateQuality = (quality: number) => {
		if (!window.hls) return;
		window.hls.levels.forEach((level, index) => {
			if (level.height === quality) {
				window.hls.currentLevel = index;
			}
		});
	};

	return (
		<PageBlock title={'Kiyo'} loading={info.loading} flash={{ type: 'flex', key: 'watch' }}>
			<div class={'flex justify-center'}>
				<div class={'flex flex-col w-full mt-4 max-w-7xl'}>
					<Switch>
						<Match when={playerMode() === 'kiyo'} keyed={false}>
							<video id={'player'} autoplay controls poster={'https://media.tenor.com/64BYBgDG41QAAAAC/loading.gif'}/>
						</Match>
						<Match when={playerMode() === 'embedded'} keyed={false}>
							<div class={'h-[45rem]'}>
								{/* @ts-ignore: deprecated but solves problem. */}
								<iframe id={'embedded-player'} src={embedded()} scrolling={'no'} allowfullscreen class={'h-full w-full overflow-hidden outline-none'}/>
							</div>
						</Match>
					</Switch>
					<Show when={info()?.episodes} keyed={false}>
						<div class={'flex flex-col w-full'}>
							<div class={'flex h-10 justify-between bg-primary'}>
								<div class={'flex items-center mx-1.5 gap-2'}>
									<div class={'inline-flex items-center'}>
										<span class={'ml-1 mr-2'}>Sub</span>
										<Input type={'checkbox'} label={''} onChange={() => setEp(episode()!, !dub())}/>
										<span class={'mx-2'}>Dub</span>
									</div>
								</div>
								<div class={'flex items-center mx-3 gap-1'}>
									<Icon path={backward} class={'h-8 w-8 cursor-pointer'} onClick={() => setEp(episode()! - 1, dub())}/>
									<Icon path={forward} class={'h-8 w-8 cursor-pointer'} onClick={() => setEp(episode()! + 1, dub())}/>
								</div>
							</div>
							<div class={'flex flex-col py-3 bg-secondary'}>
								<span class={'inline-flex items-center ml-4'}>
									<Icon path={folderOpen} class={'h-7 w-7'}/>
									<h3 class={'ml-2'}>{info()?.title} - EP: {episode()}</h3>
								</span>
								<span class={'ml-4 text-sm'}>Mode: {dub() ? 'Dub' : 'Sub'} | Server: {playerMode() === 'kiyo' ? 'Gogo Anime' : 'Vidstreaming'}</span>
								<span class={'ml-4 text-sm'}>Genres: {info()?.genres.join(', ')}</span>
								<div class={'inline-flex justify-between items-center mt-4'}>
									<div class={'w-14'}>
										<Switch>
											<Match when={range.end < range.perPage * 2} keyed={false}>
												<Icon path={chevronLeft} class={'h-14 w-14 text-gray-500 cursor-not-allowed'}/>
											</Match>
											<Match when={range.end >= range.perPage * 2} keyed={false}>
												<Icon path={chevronLeft} class={'h-14 w-14 cursor-pointer'} onClick={() => setRange({ start: range.start - range.perPage, end: range.end - range.perPage })}/>
											</Match>
										</Switch>
									</div>
									<div class={'flex flex-wrap w-full justify-center gap-[0.25rem]'}>
										<For each={info()?.episodes}>
											{(e) => (
												<Show when={e.number >= range.start && e.number <= range.end} keyed={false}>
													<button class={classNames('flex-[0_0_3rem] h-8 bg-cyan-700 text-gray-100 rounded', e.number === episode() && 'bg-accent-pink')} onClick={() => setEp(e.number, dub())}>{e.number}</button>
												</Show>
											)}
										</For>
									</div>
									<div class={'w-14'}>
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
						</div>
					</Show>
				</div>
			</div>
		</PageBlock>
	);
};

export default Watch;
