/* @refresh reload */
import { render } from 'solid-js/web';
import './styles/index.css';
import App from './App';
import {Router} from "@solidjs/router";

render(() => <Router><App/></Router>, document.getElementById('app') as HTMLElement);
