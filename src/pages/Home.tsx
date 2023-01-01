import {Component, createSignal, For, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import Card from "@/components/Card";
import getRecent, {RecentSeries} from "@/api/info/recent";
import {Swiper, SwiperSlide} from "swiper/solid";
import { Autoplay, Pagination } from "swiper";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import getTrending, {TrendingSeries} from "@/api/info/trending";
import {HiOutlineCalendar, HiOutlineClock, HiOutlinePlay} from "solid-icons/hi";
import {OcStack2} from "solid-icons/oc";
import { A } from '@solidjs/router'

const Banner: Component<TrendingSeries> = (props) => {
	return (
		<SwiperSlide>
			<div class={'h-60 sm:h-80 md:h-96 lg:h-[28rem]'}>
				<img src={props.banner} alt={props.title} class={'h-full w-full object-cover brightness-50 rounded-2xl'}/>
				<div class={'absolute top-6 left-7 sm:w-1/2'}>
					<h2>{props.title}</h2>
					<span class={'inline-flex items-center my-4 text-gray-200'}><HiOutlineCalendar size={20}/>&nbsp;{props.released}&nbsp;|&nbsp;<OcStack2 size={20}/>&nbsp;{props.episodes}&nbsp;Ep&nbsp;|&nbsp;<HiOutlineClock size={20}/>&nbsp;{props.duration}m</span>
					<p innerHTML={props.description} class={'invisible text-gray-200 text-sm line-clamp-7 md:visible'}/>
				</div>
				<A href={`/view/${props.id}`}>
					<button class={'absolute left-7 bottom-10 inline-flex items-center justify-center px-7 h-12 text-xl bg-blue-600 rounded-md sm:bottom-7 hover:bg-blue-500'}>
						<HiOutlinePlay size={26} class={'mr-1.5'}/>
						<span>Watch Now</span>
					</button>
				</A>
			</div>
		</SwiperSlide>
	);
};

const Home: Component = () => {
	const [recent, setRecent] = createSignal<RecentSeries[]|undefined>();
	const [trending, setTrending] = createSignal<TrendingSeries[]|undefined>();

	onMount(async () => {
		getRecent().then((res) => setRecent(res.data));
		getTrending().then((res) => setTrending(res.data));
	});

	return (
		<PageBlock title={'Home - Kiyo'}>
			<section>
				<Swiper
					spaceBetween={25}
					pagination={{ clickable: true }}
					modules={[ Autoplay, Pagination ]}
					autoplay={{ delay: 5000, stopOnLastSlide: false, disableOnInteraction: false, pauseOnMouseEnter: true }}
				>
					<For each={trending()} fallback={<h3>Loading...</h3>}>
						{(s) => <Banner {...s}/>}
					</For>
				</Swiper>
			</section>
			<section>
				<h3 class={'my-4'}>Recent Releases</h3>
				<div class={'flex flex-wrap justify-around gap-x-2 gap-y-10 sm:justify-between'}>
					<For each={recent()} fallback={<h3>Loading...</h3>}>
						{(s) => <Card id={s.id} title={s.title} thumbnail={s.thumbnail}/>}
					</For>
				</div>
			</section>
		</PageBlock>
	);
};

export default Home;
