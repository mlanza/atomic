export default function SpaceSeparated(element, key){
  this.element = element;
  this.key = key;
}

export function spacesep(element, key){
  return new SpaceSeparated(element, key);
}