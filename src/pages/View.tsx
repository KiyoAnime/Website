import {Component, createEffect, createSignal, onMount, Show} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import {useParams} from "@solidjs/router";
import getInfo, {Anime} from "@/api/info";
import Btn from "@/components/Button";
import {HiOutlineCalendar, HiOutlineChartBar, HiOutlineClock, HiOutlinePlay} from "solid-icons/hi";
import {OcStack2} from "solid-icons/oc";

const View: Component = () => {
	const { id } = useParams();
	const stats = 'hidden md:block';
	const [anime, setAnime] = createSignal<Anime|undefined>();
	const [bgColor, setBgColor] = createSignal<string|undefined>();
	const [popularity, setPopularity] = createSignal<string|undefined>();

	onMount(() => {
		getInfo(parseInt(id)).then((res) => {
			setAnime(res.data);
			setBgColor(res.data.color);
			setPopularity(Intl.NumberFormat('en', { notation: 'compact' }).format(res.data.popularity));
		});
	});

	createEffect(() => {
		if (anime()) {
			window.document.title = `Viewing ${anime()?.title} - Kiyo`;
		}
	});
	return (
		<PageBlock title={`Viewing `} bgGradient={{ position: 'to bottom', color1: bgColor(), color2: 'var(--background-color)' }}>
			<Show when={anime()} keyed={false} fallback={<h3>Loading...</h3>}>
				<div class={'flex justify-center mt-12 md:justify-start sm:mt-20 md:mt-28'}>
					<div class={'flex flex-col items-center w-11/12 md:flex-row md:items-start'}>
						<img src={anime()?.thumbnail} alt={anime()?.title} class={'h-96 w-64 rounded-xl'}/>
						<div class={'flex flex-col items-center md:items-start md:ml-4'}>
							<span class={'h-14 mt-2 text-5xl text-gray-200 line-clamp-1 md:mt-0'}>{anime()?.title}</span>
							<span>Genres: {anime()?.genres.join(', ')}</span>
							<div class={'inline-flex items-center mt-3'}>
								<Btn.Blue onClick={() => { window.location.href = `/watch/${id}` }}>
									<HiOutlinePlay size={20} class={'mr-1'}/>
									<span>Watch Now</span>
								</Btn.Blue>
							</div>
							<div class={'flex items-center mt-4'}>
								<OcStack2/>&nbsp;<span class={stats}>Episodes:&nbsp;</span>{anime()?.episodes}&nbsp;|&nbsp;
								<HiOutlineClock/>&nbsp;<span class={stats}>Duration:&nbsp;</span>{anime()?.duration}m&nbsp;|&nbsp;
								<HiOutlineCalendar/>&nbsp;<span class={stats}>Year:&nbsp;</span>{anime()?.released}&nbsp;|&nbsp;
								<HiOutlineChartBar/>&nbsp;<span class={stats}>Popularity:&nbsp;</span>{popularity()}
							</div>
							<span innerHTML={anime()?.description} class={'mt-4'}/>
						</div>
					</div>
				</div>
			</Show>
		</PageBlock>
	)
};

export default View;
