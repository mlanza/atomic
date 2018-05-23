import {protocol, satisfies} from "../types/protocol";

function _embedIn(child, parent){
  parent.appendChild(child);
}
export const IElementEmbeddable = protocol({
  embedIn: _embedIn,
  embeddedIn: null,
  unembedIn: null,
  toggleEmbedIn: null
});
export const embedIn = IElementEmbeddable.embedIn;
export const toggleEmbedIn = IElementEmbeddable.toggleEmbedIn;
export const unembedIn = IElementEmbeddable.unembedIn;
export const embeddedIn = IElementEmbeddable.embeddedIn;
export const isElementEmbeddable = satisfies(IElementEmbeddable);
export default IElementEmbeddable;

export function embed(parent, child){
  embedIn(child, parent);
  return parent;
}

export function toggleEmbed(parent, child){
  toggleEmbedIn(child, parent);
  return parent;
}

export function unembed(parent, child){
  unembedIn(child, parent);
  return parent;
}

export function embeds(parent, child){
  return embeddedIn(child, parent);
}