import {Component, createEffect, createSignal, Match, ParentProps, Show, Switch} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {A, Outlet, useRouteData} from "@solidjs/router";
import Btn from "@/components/Button";
import {Icon} from "solid-heroicons";
import {playCircle, square_3Stack_3d, tv, chartBar, share} from "solid-heroicons/outline";
import dayjs from "dayjs";
import {animeData} from "@/App";
import CopyOnClick from "@/components/CopyOnClick";
import classNames from "classnames";
import Container from "@/components/Container";

interface Aired {
	end?: string;
	start: string;
}

interface ItemProps {
	id: number;
	href: string;
}

const Item: Component<ParentProps<ItemProps>> = (props) => (<A href={`/view/${props.id}/${props.href}`} activeClass={'bg-tertiary'} class={'inline-flex items-center h-full p-2 text-gray-300 rounded hover:bg-quaternary'} end>{props.children}</A>)
const Badge: Component<ParentProps<{ nsfw?: boolean }>> = (props) => (<span class={classNames('inline-flex items-center h-6 p-1 bg-green-700 rounded', !!props.nsfw && 'bg-red-500')}>{props.children}</span>);

const View: Component = () => {
	const info = useRouteData<typeof animeData>();
	const icon = 'h-5 w-5 mr-1 shrink-0';
	const stats = 'hidden md:block';
	const [aired, setAired] = createSignal<Aired|undefined>();

	createEffect(() => {
		if (info.loading) return;
		setAired({
			start: dayjs(`${info()?.start.year}-${info()?.start.month}-${info()?.start.day}`).format('MMM Do, YYYY'),
			end: info()?.end ? dayjs(`${info()?.end?.year}-${info()?.end?.month}-${info()?.end?.day}`).format('MMM Do, YYYY') : undefined
		});
	}, [info.loading]);

	return (
		<PageBlock title={info()?.titles.english ? info()?.titles.english : info()?.title} loading={info.loading}>
			<img src={info()?.banner} alt={info()?.title} class={'hidden rounded-lg brightness-50 blur-[3px] md:block'}/>
			<Container size={'medium'} class={'relative z-2'}>
				<div class={'flex flex-col items-center mt-8 md:flex-row md:items-start md:-mt-12 lg:-mt-36'}>
					<div class={'flex flex-col w-64 shrink-0'}>
						<img src={info()?.thumbnail} alt={info()?.title} class={'h-96 w-full rounded-t-xl'}/>
						<div class={'flex flex-row justify-center py-2 px-2.5 bg-secondary rounded-b-xl md:flex-col md:justify-start'}>
							<div class={'inline-flex items-center'}>
								<Icon path={square_3Stack_3d} class={icon}/>
								<span class={stats}>Episodes:&nbsp;</span>
								<span class={'mr-1'}>{info()?.episodeCount}</span>
							</div>
							<Show when={info()?.rating} keyed={false}>
								<div class={'inline-flex items-center'}>
									<Icon path={chartBar} class={icon}/>
									<span class={stats}>Rating:&nbsp;</span>
									<span class={'mr-1'}>{info()?.rating}%</span>
								</div>
							</Show>
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
							<a href={`https://anilist.co/anime/${info()?.id}`} target={'_blank'} class={'mr-1'}>AniList</a>&bull;
							<a href={`https://myanimelist.net/anime/${info()?.mal}`} target={'_blank'} class={'ml-1'}>MyAnimeList</a>
						</span>
					</div>
					<div class={'flex flex-col items-center md:items-start md:ml-4'}>
						<span class={'h-[3.25rem] mt-2 text-5xl text-gray-200 overflow-hidden line-clamp-1 md:mt-0'}>{info()?.title}</span>
						<div class={'inline-flex items-center mt-1 gap-2'}>
							<Badge>{info()?.type}</Badge>
							<Switch>
								<Match when={info()?.sub! && info()?.dub!} keyed={false}>
									<Badge>SUB/DUB</Badge>
								</Match>
								<Match when={info()?.sub!} keyed={false}>
									<Badge>SUB</Badge>
								</Match>
								<Match when={info()?.dub!} keyed={false}>
									<Badge>DUB</Badge>
								</Match>
							</Switch>
							<Show when={info()?.adult!} keyed={false}>
								<Badge nsfw>NSFW</Badge>
							</Show>
						</div>
						<div class={'inline-flex items-center mt-4 gap-x-2'}>
							<A href={`/watch/${info()?.id}`}>
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
						<span class={'mt-3 text-gray-100'}>Genres: {info()?.genres.join(', ')}</span>
						<div class={'inline-flex items-center h-11 mt-3 p-1 gap-x-1 bg-secondary rounded-lg'}>
							<Item id={info()?.id!} href={''}>Description</Item>
							<Item id={info()?.id!} href={'order'}>Watch Order</Item>
							<Item id={info()?.id!} href={'trailer'}>Trailer</Item>
							<Item id={info()?.id!} href={'advanced'}>Advanced</Item>
						</div>
						<div class={'mt-4'}>
							<Outlet/>
						</div>
					</div>
				</div>
			</Container>
		</PageBlock>
	)
};

export default View;
