import elementFromHtmlString from '../../utils/elementFromString';
import generateHomeUI from './homePage/homeContainer';

const UIWrapper = elementFromHtmlString(`
<div class="h-full ">
    <h1 class=" text-xl text-red-400 font-bold">UI Wrapper</h1>
</div>
`);

const homeUI = generateHomeUI();

UIWrapper.appendChild(homeUI);

export default UIWrapper;
