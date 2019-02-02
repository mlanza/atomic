import {each} from 'cloe/core';
import {embed} from "../../protocols/iembeddable/concrete";
import {_ as v} from "param.macro";

export default Element;

export function element(name, ...contents){
  const el = document.createElement(name);
  each(embed(v, el), contents);
  return el;
}

export function isElement(self){
  return self instanceof Element;
}