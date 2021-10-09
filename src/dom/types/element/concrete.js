import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import {InvalidHostElementError} from "./types/invalid-host-element-error.js";

export function replaceWith(self, other){
  const parent = _.parent(self),
        replacement = _.isString(other) ? self.ownerDocument.createTextNode(other) : other;
  parent.replaceChild(replacement, self);
}

export function wrap(self, other){
  replaceWith(self, other);
  mut.append(other, self);
}

export function isVisible(el){
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function enable(self, enabled){
  self.disabled = !enabled;
  return self;
}

function check(self, selector){
  return _.isString(selector);
}

export const matches = _.pre(function matches(self, selector){
  return self.matches ? self.matches(selector) : false; //e.g. HTMLDocument doesn't have `matches`
}, check);

export function closest(self, selector){
  let target = self;
  while(target){
    if (matches(target, selector)){
      return target;
    }
    target = _.parent(target);
  }
}

export function assert(el, selector){
  if (!matches(el, selector)) {
    throw new InvalidHostElementError(el, selector);
  }
}
