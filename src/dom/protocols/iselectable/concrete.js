import {overload, matches, isString, pre} from "atomic/core";
import {ISelectable} from "./instance.js";

const sel02 = pre(function sel02(selector, context){
  return ISelectable.sel(context, selector);
}, isString);

function sel01(selector){
  return sel02(selector, document);
}

export const sel = overload(null, sel01, sel02);

const sel12 = pre(function sel12(selector, context){
  return ISelectable.sel1(context, selector);
}, isString);

function sel11(selector){
  return sel12(selector, document);
}

export const sel1 = overload(null, sel11, sel12);
