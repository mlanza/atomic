import {overload} from '../../core';

export default function SpaceSeparated(element, key){
  this.element = element;
  this.key = key;
}

function spaceSep2(element, key){
  return new SpaceSeparated(element, key);
}

function spaceSep1(key){
  return function(element){
    return spaceSep2(element, key);
  }
}

export const spaceSep = overload(null, spaceSep1, spaceSep2);
export const classes  = spaceSep1("class");