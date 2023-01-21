import {JSXElement} from "solid-js";

export interface IconI {
	mini?: boolean;
	path: JSXElement;
	outline?: boolean;
}

export type FormEvent = Event & { submitter: HTMLElement; } & { currentTarget: HTMLFormElement; target: Element; };
export type InputChangeEvent = Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement; target: Element; };
