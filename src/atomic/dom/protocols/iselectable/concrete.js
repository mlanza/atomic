import * as _ from "atomic/core";
import {ISelectable} from "./instance.js";

const sel02 = _.pre(function sel02(selector, context){
  return ISelectable.sel(context, selector);
}, _.isString);

function sel01(selector){
  return sel02(selector, document);
}

export const sel = _.overload(null, sel01, sel02);

const sel12 = _.pre(function sel12(selector, context){
  return ISelectable.sel1(context, selector);
}, _.isString);

function sel11(selector){
  return sel12(selector, document);
}

export const sel1 = _.overload(null, sel11, sel12);
