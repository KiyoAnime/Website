import {Component} from "solid-js";
import styles from '@/styles/loader.module.css';

const Loader: Component = () => (
	<div class={'flex justify-center h-full w-full fixed'}>
		<span class={styles.loader}/>
	</div>
);

export default Loader;
