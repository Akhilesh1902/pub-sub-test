import './style.css';
import UIWrapper from './components/UI/uiComponent.ts';
import { createNewWorld } from './threejs/world.ts';
import topNav from './components/UI/navigation/topnav.ts';

const appContainer = document.querySelector<HTMLDivElement>('#app');
const uiContainer = document.querySelector<HTMLDivElement>('.ui_container');
const navContainer = document.querySelector<HTMLDivElement>('.nav_container');
navContainer?.append(topNav());
uiContainer?.append(UIWrapper);
createNewWorld();
