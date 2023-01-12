import {JSXElement} from "solid-js";

export interface IconI {
	mini?: boolean;
	path: JSXElement;
	outline?: boolean;
}

export type FormEvent = Event & { submitter: HTMLElement; } & { currentTarget: HTMLFormElement; target: Element; };
