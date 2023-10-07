export default function elementFromHtmlString(html: string): Element {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  if (template.content.firstElementChild !== null)
    return template.content.firstElementChild;
  else
    return elementFromHtmlString(`
    <div> Error in heml template</div>
    `);
}

export function elementFromHtmlStringWithMultipleChildren(
  html: string
): NodeList | null {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.childNodes;
}
