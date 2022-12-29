import {Component, createSignal, For, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import Card from "@/components/Card";
import getRecent, {RecentSeries} from "@/api/info/recent";
import {Swiper, SwiperSlide} from "swiper/solid";
import { Autoplay } from "swiper";
import 'swiper/css';
import 'swiper/css/autoplay';
import classNames from "classnames";
import getTrending, {TrendingSeries} from "@/api/info/trending";
import Btn from "@/components/Button";

const Banner: Component<TrendingSeries> = (props) => {
	return (
		<SwiperSlide>
			<div class={'lg:h-[28rem]'}>
				<img src={props.banner} alt={props.title} class={'h-full w-full object-cover brightness-50 rounded-2xl'}/>
				<div class={'absolute top-6 left-6 w-1/2'}>
					<h2>{props.title}</h2>
					<p innerHTML={props.description} class={'mt-4 text-sm line-clamp-7'}/>
				</div>
				<button class={'absolute left-8 bottom-8 inline-flex items-center justify-center px-7 h-12 text-xl bg-blue-600 rounded-md hover:bg-blue-500'}>Watch Now</button>
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
		<PageBlock title={'Home'}>
			<section>
				<Swiper spaceBetween={25} modules={[Autoplay]} autoplay={{ delay: 5000, stopOnLastSlide: false }}>
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
