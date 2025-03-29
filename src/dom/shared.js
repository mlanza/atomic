import * as _ from "atomic/core";
import {InvalidHostElementError} from "./types/invalid-host-element-error.js";

function check(self, selector){
  return _.isString(selector);
}

export const matches = _.pre(function matches(self, selector){
  return self.matches ? self.matches(selector) : false; //e.g. HTMLDocument doesn't have `matches`
}, check);

export function assert(el, selector){
  if (!matches(el, selector)) {
    throw new InvalidHostElementError(el, selector);
  }
}

export function hidden(el){
  return document.contains(el) ? window.getComputedStyle(el).display === "none" : el.style.display === "none";
}
