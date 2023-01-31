import {Component, Match, ParentProps, Switch} from "solid-js";
import classNames from "classnames";
import {A} from "@solidjs/router";

type Props =  {
	url?: string;
	nav?: boolean;
	active?: string;
	loading?: boolean;
	onClick?: () => void;
	type?: 'submit'|'button';
} | {
	nav: true;
	url: string;
	active?: string;
	loading?: boolean;
	onClick?: () => void;
	type?: 'submit'|'button';
}

type BtnProps = Props & {
	className: string;
}

const BaseBtn: Component<ParentProps<BtnProps>> = (props) => (
	<Switch>
		<Match when={!props.nav} keyed={false}>
			<a href={props.url} onClick={props.onClick}>
				<Btn {...props}/>
			</a>
		</Match>
		<Match when={!!props.nav} keyed={false}>
			<A href={props.url!} onClick={props.onClick} activeClass={props.active} end>
				<Btn {...props}/>
			</A>
		</Match>
	</Switch>
);

const Btn: Component<ParentProps<BtnProps>> = (props) => (
	<button class={classNames('inline-flex items-center justify-center px-5 h-10 text-center whitespace-nowrap text-gray-200 no-underline rounded-md hover:bg-quaternary', props.className, props.loading && 'cursor-not-allowed', !!props.nav && 'hidden h-11 px-[0.875rem] lg:text-xl md:inline-flex')} disabled={props.loading} type={props.type}>
		<Switch>
			<Match keyed={false} when={props.loading}>
				<svg class={'animate-spin text-gray-600 fill-gray-200 h-4 w-4'} viewBox={'0 0 100 101'}>
					<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
					<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
			</Match>
			<Match keyed={false} when={!props.loading}>
				{props.children}
			</Match>
		</Switch>
	</button>
);

const RedBtn: Component<ParentProps<Props>> = (props) => (
	<BaseBtn {...props} className={'bg-red-600 hover:bg-red-500'}/>
);

const BlueBtn: Component<ParentProps<Props>> = (props) => (
	<BaseBtn {...props} className={'bg-blue-600 hover:bg-blue-500'}/>
);

const GreyBtn: Component<ParentProps<Props>> = (props) => (
	<BaseBtn {...props} className={'bg-slate-600 hover:bg-slate-500'}/>
);

const TextBtn: Component<ParentProps<Props>> = (props) => (
	<BaseBtn {...props} className={'bg-transparent hover:bg-tertiary'}/>
);

const GreenBtn: Component<ParentProps<Props>> = (props) => (
	<BaseBtn {...props} className={'bg-green-700 hover:bg-green-600'}/>
);

// const YellowBtn: Component<ParentProps<Props>> = (props) => (
// 	<Btn {...props} className={'bg-yellow-600 hover:bg-yellow-500'}/>
// );

export default Object.assign(Btn, {
	Red: RedBtn,
	Blue: BlueBtn,
	Grey: GreyBtn,
	Text: TextBtn,
	Green: GreenBtn
});
