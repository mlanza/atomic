import {overload} from '../../core';

export default function SpaceSeparated(element, key){
  this.element = element;
  this.key = key;
}

function spacesep2(element, key){
  return new SpaceSeparated(element, key);
}

function spacesep1(key){
  return function(element){
    return spacesep2(element, key);
  }
}

export const spacesep = overload(null, spacesep1, spacesep2);
export const classes  = spacesep1("class");