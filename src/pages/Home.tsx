import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import {Component,For,createResource} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import Card from "@/components/Card";
import getRecent from "@/api/info/recent";
import {Swiper, SwiperSlide} from "swiper/solid";
import { Autoplay, Pagination } from "swiper";
import getTrending, {TrendingSeries} from "@/api/info/trending";
import { A } from '@solidjs/router'
import {Icon} from "solid-heroicons";
import {calendar, clock, informationCircle, square_3Stack_3d} from "solid-heroicons/outline";

const Banner: Component<TrendingSeries> = (props) => {
	return (
		<SwiperSlide>
			<div class={'h-60 sm:h-80 md:h-96 lg:h-[28rem]'}>
				<img src={props.banner} alt={props.title} class={'h-full w-full object-cover brightness-50 rounded-2xl'}/>
				<div class={'absolute top-6 left-7 sm:w-1/2'}>
					<h2 class={'line-clamp-2'}>{props.title}</h2>
					<span class={'inline-flex items-center my-4 text-gray-200'}>
						<Icon path={calendar} class={'h-5 w-5 mr-1'}/>{props.released}&nbsp;|&nbsp;
						<Icon path={square_3Stack_3d} class={'h-5 w-5 mr-1'}/>{props.episodes}&nbsp;Ep&nbsp;|&nbsp;
						<Icon path={clock} class={'h-5 w-5 mr-1'}/>{props.duration}m</span>
					<p innerHTML={props.description} class={'invisible text-gray-200 text-sm line-clamp-7 md:visible'}/>
				</div>
				<A href={`/view/${props.id}`}>
					<button class={'absolute left-7 bottom-10 inline-flex items-center justify-center px-7 h-12 text-xl text-gray-300 bg-blue-600 rounded-md sm:bottom-7 hover:bg-blue-500'}>
						<Icon path={informationCircle} class={'h-6 w-6 mr-1.5 -ml-1'}/>
						<span>View</span>
					</button>
				</A>
			</div>
		</SwiperSlide>
	);
};

const Home: Component = () => {
	const [recent] = createResource(async () => {
		return await getRecent().then((res) => res.data);
	});

	const [trending] = createResource(async () => {
		return await getTrending().then((res) => res.data);
	});

	return (
		<PageBlock title={'Home • Kiyo'} loading={recent.loading || trending.loading}>
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
				<div class={'card-grid'}>
					<For each={recent()} fallback={<h3>Loading...</h3>}>
						{(s) => <Card {...s}/>}
					</For>
				</div>
			</section>
		</PageBlock>
	);
};

export default Home;
