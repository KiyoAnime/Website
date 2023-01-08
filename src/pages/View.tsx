import {Component, createSignal, onMount, ParentProps, Show} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {A, useParams} from "@solidjs/router";
import getInfo, {Anime} from "@/api/info/info";
import Btn from "@/components/Button";
import {Icon} from "solid-heroicons";
import {chartBar, clock, playCircle, square_3Stack_3d} from "solid-heroicons/outline";
import dayjs from "dayjs";

const Badge: Component<ParentProps> = (props) => (<span class={'inline-flex items-center h-6 p-1 bg-green-700 rounded'}>{props.children}</span>);

const View: Component = () => {
	const { id } = useParams();
	const icon = 'h-5 w-5 mr-1';
	const stats = 'hidden md:block';
	const [anime, setAnime] = createSignal<Anime|undefined>();
	const [popularity, setPopularity] = createSignal<string|undefined>();
	const [aired, setAired] = createSignal<{ start: string; end: string|undefined; }|undefined>();

	onMount(() => {
		getInfo(parseInt(id), false).then((res) => {
			setAnime(res.data);
			setPopularity(Intl.NumberFormat('en', { notation: 'compact' }).format(res.data.popularity));
			setAired({
				start: dayjs(`${anime()?.start.year}-${anime()?.start.month}-${anime()?.start.day}`).format('MMMM Do, YYYY'),
				end: anime()?.end.year ? dayjs(`${anime()?.end.year}-${anime()?.end.month}-${anime()?.end.day}`).format('MMMM Do, YYYY') : undefined
			});
			document.title = `${res.data.title} • Kiyo`;
		});
	});

	return (
		<PageBlock title={`Kiyo`} bgGradient={{ position: 'to bottom', color1: anime()?.color, color2: 'var(--background-color)' }} loading={!anime()}>
			<div class={'flex justify-center mt-12 md:justify-start sm:mt-20 md:mt-28'}>
				<div class={'flex flex-col items-center w-11/12 md:flex-row md:items-start'}>
					<div class={'flex flex-col shrink-0'}>
						<img src={anime()?.thumbnail} alt={anime()?.title} class={'h-96 w-64 rounded-xl'}/>
						<span class={'hidden py-1 px-2 text-center md:block'}>
							<A href={`https://anilist.co/anime/${id}/`} target={'_blank'} class={'text-sky-600'}>AniList</A>&nbsp;&bull;&nbsp;
							<A href={`https://myanimelist.net/anime/${anime()?.mal}`} target={'_blank'} class={'text-sky-600'}>MyAnimeList</A>
						</span>
					</div>
					<div class={'flex flex-col items-center md:items-start md:ml-4'}>
						<span class={'h-14 mt-2 text-5xl text-gray-200 line-clamp-1 md:mt-0'}>{anime()?.title}</span>
						<div class={'inline-flex items-center mt-0.5 gap-2'}>
							<Badge>{anime()?.type}</Badge>
							<Badge>{anime()?.subOrDub.replace('sub', 'SUB').replace('dub', 'DUB')}</Badge>
							<Show when={anime()?.adult} keyed={false}>
								<Badge>NSFW</Badge>
							</Show>
						</div>
						<div class={'inline-flex items-center mt-4'}>
							<A href={`/watch/${id}`}>
								<Btn.Blue>
									<Icon path={playCircle} class={'h-5 w-5 mr-1 -ml-0.5'}/>
									<span>Watch</span>
								</Btn.Blue>
							</A>
						</div>
						<span class={'mt-3'}>Genres: {anime()?.genres.join(', ')}</span>
						<div class={'inline-flex items-center mt-1'}>
							<Icon path={square_3Stack_3d} class={icon}/><span class={stats}>Episodes:&nbsp;</span>{anime()?.episodeCount}&nbsp;|&nbsp;
							<Icon path={clock} class={icon}/><span class={stats}>Duration:&nbsp;</span>{anime()?.duration}m&nbsp;|&nbsp;
							<Icon path={chartBar} class={icon}/><span class={stats}>Popularity:&nbsp;</span>{popularity()}
						</div>
						<span class={'mt-1.5'}>
							Aired: {aired()?.start}
							<Show when={aired()?.end} keyed={false}>
								&nbsp;to {aired()?.end}
							</Show>
						</span>
						<span innerHTML={anime()?.description} class={'mt-4'}/>
					</div>
				</div>
			</div>
		</PageBlock>
	)
};

export default View;
