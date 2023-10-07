import elementFromHtmlString from '../../../utils/elementFromString';
import { LandingButtons } from '../../../utils/pubSubEvnets';
import PubSub from 'pubsub-js';

export default function generateHomeUI() {
  console.log('generating home ui');
  const homeUI = elementFromHtmlString(`
  <div class="flex flex-col items-center border-2  border-slate-400 rounded-lg h-full">
    <h2 class="font-medium text-xl my-4">Sample room</h2>
    <div class="home_button_container w-full flex justify-around">
      
    </div>
  </div>
  `);

  ['Furniture', 'Lighting', 'Accessories'].forEach((item) => {
    const homeUIButtons = homeButtons(item);
    homeUIButtons.addEventListener('click', (e) => {
      const element = e.target as HTMLButtonElement;

      PubSub.publish(LandingButtons, element.dataset.name);
    });
    homeUI.querySelector('.home_button_container')?.append(homeUIButtons);
  });

  //   console.log(homeUI);

  return homeUI;
}

const homeButtons = (innertext: string) => {
  return elementFromHtmlString(`
    <button data-name=${innertext} class=" px-3 p-2 rounded-md border-2 text-sm border-slate-400">${innertext}</button>
    `);
};
