import {Component, createEffect, createSignal, ParentProps, Show} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {A, Outlet, useRouteData} from "@solidjs/router";
import Btn from "@/components/Button";
import {Icon} from "solid-heroicons";
import {clock, playCircle, square_3Stack_3d, tv, chartBar, share} from "solid-heroicons/outline";
import dayjs from "dayjs";
import {animeData} from "@/App";
import CopyOnClick from "@/components/CopyOnClick";

interface ItemProps {
	id: number;
	href: string;
}

const Item: Component<ParentProps<ItemProps>> = (props) => (<A href={`/view/${props.id}/${props.href}`} activeClass={'bg-tertiary'} class={'inline-flex items-center h-full p-2 text-gray-300 rounded hover:bg-quaternary'} end>{props.children}</A>)
const Badge: Component<ParentProps> = (props) => (<span class={'inline-flex items-center h-6 p-1 bg-green-700 rounded'}>{props.children}</span>);

const View: Component = () => {
	const data = useRouteData<typeof animeData>();
	const icon = 'h-5 w-5 mr-1';
	const stats = 'hidden md:block';
	const [popularity, setPopularity] = createSignal<string|undefined>();
	const [aired, setAired] = createSignal<{ start: string; end: string|undefined; }|undefined>();

	createEffect(() => {
		if (data.loading) return;
		setPopularity(Intl.NumberFormat('en', { notation: 'compact' }).format(data()?.popularity!));
		setAired({
			start: dayjs(`${data()?.start.year}-${data()?.start.month}-${data()?.start.day}`).format('MMM Do, YYYY'),
			end: data()?.end.year && data()?.end.month && data()?.end.day ? dayjs(`${data()?.end.year}-${data()?.end.month}-${data()?.end.day}`).format('MMM Do, YYYY') : undefined
		});
	}, [data.loading]);

	return (
		<PageBlock title={`Kiyo`} loading={data.loading}>
			<div class={'flex justify-center mt-12 md:justify-start sm:mt-20 md:mt-28'}>
				<div class={'flex flex-col items-center w-11/12 md:flex-row md:items-start'}>
					<div class={'flex flex-col w-64 shrink-0'}>
						<img src={data()?.thumbnail} alt={data()?.title} class={'h-96 w-full rounded-t-xl'}/>
						<div class={'flex flex-row justify-center py-2 px-2.5 bg-secondary rounded-b-xl md:flex-col md:justify-start'}>
							<div class={'inline-flex items-center'}>
								<Icon path={square_3Stack_3d} class={icon}/>
								<span class={stats}>Episodes:&nbsp;</span>
								<span class={'mr-1'}>{data()?.episodeCount}</span>
							</div>
							<div class={'inline-flex items-center'}>
								<Icon path={chartBar} class={icon}/>
								<span class={stats}>Popularity:&nbsp;</span>
								<span class={'mr-1'}>{popularity()}</span>
							</div>
							<div class={'inline-flex items-center'}>
								<Icon path={clock} class={icon}/>
								<span class={stats}>Duration:&nbsp;</span>
								<span>{data()?.duration}m</span>
							</div>
							<div class={'hidden md:inline-flex'}>
								<Icon path={tv} class={icon}/>
								<span class={stats}>
									Aired: {aired()?.start}&nbsp;
									<Show when={aired()?.end} keyed={false}>
										to {aired()?.end}
									</Show>
								</span>
							</div>
						</div>
						<span class={'hidden py-1 px-2 text-center md:block'}>
							<a href={`https://anilist.co/anime/${data()?.id}/`} target={'_blank'}>AniList</a>&nbsp;&bull;&nbsp;
							<a href={`https://myanimelist.net/anime/${data()?.mal}`} target={'_blank'}>MyAnimeList</a>
						</span>
					</div>
					<div class={'flex flex-col items-center md:items-start md:ml-4'}>
						<span class={'h-[3.25rem] mt-2 text-5xl text-gray-200 overflow-hidden line-clamp-1 md:mt-0'}>{data()?.title}</span>
						<div class={'inline-flex items-center mt-1 gap-2'}>
							<Badge>{data()?.type}</Badge>
							<Badge>{data()?.subOrDub.replace('sub', 'SUB').replace('dub', 'DUB')}</Badge>
							<Show when={data()?.adult!} keyed={false}>
								<Badge>NSFW</Badge>
							</Show>
						</div>
						<div class={'inline-flex items-center mt-4 gap-x-2'}>
							<A href={`/watch/${data()?.id}`}>
								<Btn.Blue>
									<Icon path={playCircle} class={'h-5 w-5 mr-1 -ml-1'}/>
									<span>Watch</span>
								</Btn.Blue>
							</A>
							<CopyOnClick text={window.location.href}>
								<Btn.Blue>
									<Icon path={share} class={'h-5 w-5 mr-1 -ml-1'}/>
									<span>Share</span>
								</Btn.Blue>
							</CopyOnClick>
						</div>
						<span class={'mt-3 text-gray-100'}>Genres: {data()?.genres.join(', ')}</span>
						<div class={'inline-flex items-center h-11 mt-3 p-1 gap-x-2 bg-secondary rounded-lg'}>
							<Item id={data()?.id!} href={''}>Description</Item>
							<Item id={data()?.id!} href={'order'}>Release Order</Item>
							<Item id={data()?.id!} href={'trailer'}>Trailer</Item>
						</div>
						<div class={'mt-4'}>
							<Outlet/>
						</div>
					</div>
				</div>
			</div>
		</PageBlock>
	)
};

export default View;
