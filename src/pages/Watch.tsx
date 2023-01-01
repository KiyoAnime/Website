import {Component, createEffect, createSignal, onMount} from "solid-js";
import PageBlock from "@/elements/PageBlock";
import { useParams } from "@solidjs/router";
import Plyr from 'plyr';
import Hls from "hls.js";
import getInfo, { Anime } from "@/api/info";
import getEpisodes, { Episode } from "@/api/info/episodes";
import { createStore } from "solid-js/store";
import getStreams from "@/api/streams";
import { HiSolidFastForward, HiSolidRewind } from "solid-icons/hi";

const Watch: Component = () => {
	new Plyr('#player', {
		controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
	});
	const { sId } = useParams();
	const [info, setInfo] = createSignal<Anime | undefined>();
	const [episode, setEpisode] = createSignal<number | undefined>();
	const [data, setData] = createStore<{ total: number; episodes?: Episode[]; }>({ total: 0 });
	onMount(async () => {
		const player = document.getElementById('player') as HTMLMediaElement;
		if (!player) return;
		const mobileInformation = isMobile().toLowerCase();
		if (mobileInformation.includes('iphone') || mobileInformation.includes('ipad')) {
			alert('This website is not supported on iOS devices. Please use a desktop browser.');
			return;
		}
		await getInfo(parseInt(sId)).then((res) => setInfo(res.data));
		await getEpisodes(parseInt(sId)).then((res) => setData({ total: res.data.total, episodes: res.data.episodes }));
		if (!data.episodes) return;
		if (!player) return;
		if (Hls.isSupported()) await setEp(1, true);
	});

	function isMobile() {
		var check = false;
		(function (a) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
				check = true;
		})(navigator.userAgent || navigator.vendor);
		return navigator.userAgent;
	};

	const setEp = async (ep: number, first: boolean): Promise<void> => {
		const hls = new Hls();
		setEpisode(ep);
		const player = document.getElementById('player') as HTMLMediaElement;
		console.log('function init');
		if (!data.episodes) return console.log('ep failed');
		await getStreams(data.episodes[ep - 1].id).then(async (res) => {
			console.log('streams loaded');
			if (!player) return console.log('player failed');
			const stream = res.data.filter((s) => s.quality === '1080p' || s.quality === '720p' || s.quality == 'default')[0].url;
			console.log(stream);
			if (!stream) console.log('stream failed');
			await hls.loadSource(stream);
			console.log('source loaded');
			await hls.attachMedia(player);
			console.log('media attached');
			await hls.on(Hls.Events.MANIFEST_PARSED, () => {
				console.log('manifest parsed');
				if (first) player.play();
				else {
					player.currentTime = 0;
					player.play();
				}
			});
		});
	};

	createEffect(async () => {
		const title = await info()?.title;
		if (title)  window.document.title = `Watching ${title} - Kiyo`;
	});

	return (
		<PageBlock title={`Watching`}>
			<div class={'flex flex-col h-full'}>
				<h1 class={'mb-6'}>{info()?.title} | Ep: {episode()}</h1>
				<video id={'player'} class={'w-full max-w-6xl'} preload={'none'} controls src={''} />
				<div class={'flex flex-col w-full max-w-6xl bg-secondary h-32'}>
					<div class={'flex justify-between h-8 bg-primary'}>
						<span />
						<div class={'inline-flex px-3'}>
							<HiSolidRewind size={28} onClick={() => setEp(episode()! - 1, false)} class={'cursor-pointer'}/>&nbsp;
							<HiSolidFastForward size={28} onClick={async () => await setEp(episode()! + 1, false)} class={'cursor-pointer'}/>
						</div>
					</div>
				</div>
			</div>

			{/*<div class={'flex justify-start items-start mt-4'}>*/}
			{/*	<div class={'flex flex-wrap justify-around mt-6 gap-x-2 gap-y-5 sm:justify-between'}>*/}
			{/*		<For each={data.episodes}>*/}
			{/*			{(episode) => (*/}
			{/*				<button class={`${current() == episode.number ? 'bg-[#6FB28F] text-[#232323]' : 'bg-[#3A6281]'} text-white rounded-md w-12 h-8 text-xl font-bold`} onClick={handleClick} ep-number={episode.number}>{episode.number}</button>*/}
			{/*			)}*/}
			{/*		</For>*/}
			{/*	</div>*/}
			{/*</div>*/}
		</PageBlock>
	);
};

export default Watch;
