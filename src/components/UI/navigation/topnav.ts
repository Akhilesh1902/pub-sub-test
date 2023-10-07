import elementFromHtmlString from '../../../utils/elementFromString';

export default function generateTopNav() {
  const nav = elementFromHtmlString(`
    <div class='flex gap-2'>
    
    </div>
    `);

  ['day/night', 'reset'].forEach((item) => {
    const navbutton = navButtons(item);
    navbutton.addEventListener('click', () => {
      console.log('navClick');
    });
    nav.appendChild(navbutton);
  });

  return nav;
}

const navButtons = (innertext: string) => {
  return elementFromHtmlString(`
      <button data-name=${innertext} class=" px-3 p-2 rounded-md border-2 text-sm border-slate-400">${innertext}</button>
      `);
};
